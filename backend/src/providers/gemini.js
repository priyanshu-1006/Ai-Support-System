import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Get configured Gemini LLM for the RAG chain.
 * Make sure GOOGLE_API_KEY is in your environment variables.
 */
export function getGeminiLLM() {
    return new ChatGoogleGenerativeAI({
        modelName: "gemini-2.5-flash", // Use gemini-2.5-flash for faster responses as per PRD
        maxOutputTokens: 2048,
        temperature: 0.2, // Low temperature for more factual RAG responses
    });
}
