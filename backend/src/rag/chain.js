import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { similaritySearch } from './vectorStore.js';
import { getGeminiLLM } from '../providers/gemini.js';

// Define the system prompt
const SYSTEM_TEMPLATE = `You are Gryork Support Assistant.
You must use ONLY the provided context to answer the user's question.
If the answer is not contained in the context, say "I don't have enough information to answer that based on the current knowledge base."
Do NOT make up information.

Context:
{context}

Question:
{question}

Helpful Answer:`;

const promptTemplate = PromptTemplate.fromTemplate(SYSTEM_TEMPLATE);

/**
 * Executes the RAG pipeline for a given user query.
 * @param {string} query The user's question.
 * @returns {Promise<{ answer: string, sources: Array }>}
 */
export async function runRagPipeline(query) {
    // 1. Retrieve relevant documents
    const relevantDocs = await similaritySearch(query, 5);
    
    // 2. Format the context
    const contextStr = relevantDocs.map(doc => doc.pageContent).join('\n\n---\n\n');

    // 3. Setup the LCEL chain
    const llm = getGeminiLLM();
    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([
        {
            context: () => contextStr,
            question: new RunnablePassthrough()
        },
        promptTemplate,
        llm,
        outputParser
    ]);

    // 4. Generate the answer
    const answer = await chain.invoke(query);

    return {
        answer,
        sources: relevantDocs.map(doc => doc.metadata)
    };
}
