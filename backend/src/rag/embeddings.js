import { NomicEmbeddings } from '@langchain/nomic';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize and return the Nomic Embeddings model.
 * Make sure NOMIC_API_KEY is set in your environment variables.
 */
export function getEmbeddingsModel() {
    return new NomicEmbeddings({
        modelName: "nomic-embed-text-v1.5",
        apiKey: process.env.NOMIC_API_KEY
    });
}
