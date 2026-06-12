import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.document.count();
  const chunks = await prisma.documentChunk.count();
  console.log(`Docs: ${docs}, Chunks: ${chunks}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
