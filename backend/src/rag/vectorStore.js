import { PrismaClient, Prisma } from '@prisma/client';
import { getEmbeddingsModel } from './embeddings.js';

const prisma = new PrismaClient();

/**
 * Stores LangChain documents into the PGVector database via Prisma.
 * @param {Document[]} documents 
 * @param {string} uploaderId - The UUID of the user who uploaded the document
 */
export async function storeDocuments(documents, uploaderId = '00000000-0000-0000-0000-000000000000') {
    const embeddings = getEmbeddingsModel();

    console.log(`Generating embeddings for ${documents.length} documents...`);
    const texts = documents.map(doc => doc.pageContent);
    const vectors = await embeddings.embedDocuments(texts);

    console.log(`Saving ${documents.length} documents to the database...`);
    
    // We create a single 'Knowledge Base' Document record for all these chunks to relate to
    const mainDoc = await prisma.document.create({
        data: {
            title: 'XYZ Knowledge Base',
            filePath: 'xyz_knowledge_base.json',
            uploadedBy: uploaderId,
            status: 'ready'
        }
    });

    // Chunk the inserts to avoid query size limits (Postgres max params is 65535, 100 items * 5 = 500 params)
    const chunkSize = 100;
    for (let i = 0; i < documents.length; i += chunkSize) {
        const chunk = documents.slice(i, i + chunkSize);
        
        const values = chunk.map((doc, idx) => {
            const actualIdx = i + idx;
            const vector = vectors[actualIdx];
            const vectorStr = '[' + vector.join(',') + ']';
            return Prisma.sql`(${mainDoc.id}::uuid, ${doc.pageContent}, ${actualIdx}, ${JSON.stringify(doc.metadata)}::jsonb, ${vectorStr}::vector)`;
        });

        await prisma.$executeRaw`
            INSERT INTO "DocumentChunk" ("docId", "content", "chunkIdx", "metadata", "embedding")
            VALUES ${Prisma.join(values)}
        `;
    }
    console.log('Successfully saved documents and embeddings to PGVector.');
}

/**
 * Performs similarity search for a given query.
 * @param {string} query 
 * @param {number} k Number of results to return
 * @returns {Promise<Document[]>}
 */
export async function similaritySearch(query, k = 5) {
    const embeddings = getEmbeddingsModel();
    const queryEmbedding = await embeddings.embedQuery(query);

    // Convert natural language query into an OR-based tsquery (e.g., 'word1 | word2')
    // We replace non-alphanumeric characters with spaces so things like "product_id-P005" become "product id P005"
    const ftsQuery = query.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).filter(w => w.length > 0).join(' | ');

    // Hybrid Search combining PGVector and PostgreSQL Full-Text Search using Reciprocal Rank Fusion (RRF)
    const results = await prisma.$queryRaw`
        WITH vector_search AS (
            SELECT 
                "id", 
                row_number() over (ORDER BY "embedding" <=> ${queryEmbedding}::vector) as row_num,
                1 - ("embedding" <=> ${queryEmbedding}::vector) as similarity
            FROM "DocumentChunk"
            ORDER BY "embedding" <=> ${queryEmbedding}::vector
            LIMIT 20
        ),
        fts_search AS (
            SELECT 
                "id", 
                row_number() over (ORDER BY ts_rank(to_tsvector('english', "content"), to_tsquery('english', ${ftsQuery})) DESC) as row_num,
                ts_rank(to_tsvector('english', "content"), to_tsquery('english', ${ftsQuery})) as rank
            FROM "DocumentChunk"
            WHERE to_tsvector('english', "content") @@ to_tsquery('english', ${ftsQuery})
            ORDER BY rank DESC
            LIMIT 20
        )
        SELECT 
            c."id", 
            c."docId", 
            c."content", 
            c."chunkIdx", 
            c."metadata",
            COALESCE(1.0 / (60 + v.row_num), 0.0) + COALESCE(1.0 / (60 + f.row_num), 0.0) as rrf_score,
            COALESCE(v.similarity, 0.0) as similarity,
            COALESCE(f.rank, 0.0) as fts_rank
        FROM "DocumentChunk" c
        LEFT JOIN vector_search v ON c.id = v.id
        LEFT JOIN fts_search f ON c.id = f.id
        WHERE v.id IS NOT NULL OR f.id IS NOT NULL
        ORDER BY rrf_score DESC
        LIMIT ${k}
    `;

    // Map back to LangChain Document format for consistency in the pipeline
    return results.map(row => ({
        pageContent: row.content,
        metadata: row.metadata,
        similarity: row.similarity, // Expose original vector similarity
        rrfScore: row.rrf_score,
        ftsRank: row.fts_rank
    }));
}
