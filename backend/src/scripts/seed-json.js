import path from 'path';
import { loadKnowledgeBase } from '../rag/loader.js';
import { storeDocuments } from '../rag/vectorStore.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    try {
        console.log('Starting seed process...');
        
        // Make sure a system user exists for the foreign key constraint
        let systemUser = await prisma.user.findFirst({
            where: { email: 'system@gryork.com' }
        });

        if (!systemUser) {
            console.log('Creating system user...');
            systemUser = await prisma.user.create({
                data: {
                    email: 'system@gryork.com',
                    password: 'none', // Dummy password
                    name: 'System Admin',
                    role: 'super_admin'
                }
            });
        }

        const jsonPath = path.resolve(process.cwd(), '../xyz_knowledge_base.json');
        console.log(`Loading knowledge base from: ${jsonPath}`);

        const documents = await loadKnowledgeBase(jsonPath);
        console.log(`Parsed ${documents.length} documents from JSON.`);

        // Store docs. We temporarily mock the 'uploadedBy' with systemUser inside vectorStore, 
        // wait, let's pass systemUser.id to storeDocuments so we don't hardcode inside vectorStore.
        // Let me modify vectorStore.js to accept uploaderId, but for now let's just override it via a hack or update vectorStore.js later.
        
        await storeDocuments(documents, systemUser.id);
        
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
