import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const jsonPath = path.resolve(process.cwd(), '../xyz_knowledge_base.json');
        console.log(`Reading ${jsonPath}...`);
        
        let content = fs.readFileSync(jsonPath, 'utf8');
        
        // Replace XYZ with Gryork
        content = content.replace(/XYZ Electronics/g, 'Gryork');
        content = content.replace(/XYZ/g, 'Gryork');
        content = content.replace(/xyz\.com/g, 'gryork.com');
        
        const newJsonPath = path.resolve(process.cwd(), '../gryork_knowledge_base.json');
        fs.writeFileSync(newJsonPath, content, 'utf8');
        console.log(`Successfully wrote ${newJsonPath}`);
        
        console.log('Clearing old vector embeddings...');
        await prisma.documentChunk.deleteMany({});
        await prisma.document.deleteMany({});
        console.log('Database cleared of old documents.');
        
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
