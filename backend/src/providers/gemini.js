import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Get configured LLM for the RAG chain.
 * Using Groq because GROQ_API_KEY is available.
 */
export function getGeminiLLM() {
    return new ChatGroq({
        model: "llama-3.1-8b-instant",
        modelName: "llama-3.1-8b-instant", // Passing both for Langchain compatibility
        apiKey: process.env.GROQ_API_KEY,
        temperature: 0.2,
    });
}
