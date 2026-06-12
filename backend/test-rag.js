import { similaritySearch } from './src/rag/vectorStore.js';
import { runRagPipeline } from './src/rag/chain.js';

async function main() {
    try {
        console.log('Testing similaritySearch...');
    const results = await similaritySearch('tell me about XYZ Monitor 16');
    console.log('Results:', results);

    console.log('Testing runRagPipeline...');
    const answer = await runRagPipeline('tell me about XYZ Monitor 16', '00000000-0000-0000-0000-000000000000');
    console.log('Answer:', answer);
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
