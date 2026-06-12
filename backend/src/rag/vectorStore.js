import { PrismaClient } from '@prisma/client';
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

    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const vector = vectors[i];
        const metadata = doc.metadata;

        // Prisma doesn't natively support insert for Unsupported("vector") nicely without raw query
        // We will use $executeRaw for the vector insertion
        await prisma.$executeRaw`
            INSERT INTO "DocumentChunk" ("docId", "content", "chunkIdx", "metadata", "embedding")
            VALUES (
                ${mainDoc.id}::uuid, 
                ${doc.pageContent}, 
                ${i}, 
                ${JSON.stringify(metadata)}::jsonb, 
                ${vector}::vector
            )
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

    // Use Prisma raw query for PGVector <=> operator (cosine distance)
    const results = await prisma.$queryRaw`
        SELECT 
            "id", 
            "docId", 
            "content", 
            "chunkIdx", 
            "metadata",
            1 - ("embedding" <=> ${queryEmbedding}::vector) as similarity
        FROM "DocumentChunk"
        ORDER BY "embedding" <=> ${queryEmbedding}::vector
        LIMIT ${k}
    `;

    // Map back to LangChain Document format for consistency in the pipeline
    return results.map(row => ({
        pageContent: row.content,
        metadata: row.metadata,
        similarity: row.similarity
    }));
}
