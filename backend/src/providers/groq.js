import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Get configured Groq LLM for the RAG chain.
 * Make sure GROQ_API_KEY is in your environment variables.
 */
export function getGroqLLM() {
    return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        modelName: "llama-3.1-8b-instant", // Default Llama model
        maxTokens: 2048,
        temperature: 0.2,
    });
}
