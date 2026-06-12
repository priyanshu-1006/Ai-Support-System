import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Enabling vector extension...');
        await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`;
        console.log('Extension enabled.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
