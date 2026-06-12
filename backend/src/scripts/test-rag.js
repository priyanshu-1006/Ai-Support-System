import { runRagPipeline } from '../rag/chain.js';

async function test() {
    try {
        const query = "What is the warranty period for the XYZ SmartWatch 1?";
        console.log(`Query: "${query}"\n`);
        
        const result = await runRagPipeline(query);
        
        console.log('--- AI Response ---');
        console.log(result.answer);
        console.log('\n--- Sources ---');
        console.log(result.sources);
        
    } catch (error) {
        console.error('Error during testing:', error);
    }
}

test();
