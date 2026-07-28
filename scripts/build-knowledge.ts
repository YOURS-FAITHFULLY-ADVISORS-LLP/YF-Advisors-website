import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { createPrismaInstance, KnowledgeRepository } from './knowledge/repository';
import { crawlWebsite } from './knowledge/crawler';
import { chunkText } from './knowledge/chunker';
import { generateEmbeddings } from './knowledge/embedding';
import { TextChunk } from './knowledge/types';

async function main() {
  const startTime = Date.now();
  console.log('\n🚀 Starting Website Knowledge Base Generator...\n');

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: MISTRAL_API_KEY is not defined in .env file.');
    process.exit(1);
  }

  const prisma = createPrismaInstance();
  const repository = new KnowledgeRepository(prisma);

  try {
    // 1. Initialize DB Vector extension
    await repository.initializeDatabase();

    // 2. Crawl Website & Extract Content
    console.log('Scanning pages...');
    const pages = await crawlWebsite(prisma);

    for (const page of pages) {
      console.log(`  ✓ ${page.title} (${page.url})`);
    }

    console.log(`\nExtracted text from ${pages.length} pages.`);

    // 3. Chunk Content (500-800 chars, 100 overlap)
    console.log('\nChunking content...');
    const allChunks: TextChunk[] = [];
    const pageChunkMap = new Map<string, TextChunk[]>();

    for (const page of pages) {
      const chunks = chunkText(page.rawText, page.url, page.title, {
        minSize: 500,
        maxSize: 800,
        overlap: 100,
      });

      pageChunkMap.set(page.url, chunks);
      allChunks.push(...chunks);
    }

    console.log(`Generated ${allChunks.length} total chunks across ${pages.length} pages.`);

    // 4. Generate Embeddings via Mistral API
    console.log('\nGenerating embeddings using Mistral Embeddings API (mistral-embed)...');

    let totalSavedChunks = 0;

    for (const page of pages) {
      const pageChunks = pageChunkMap.get(page.url) || [];
      if (pageChunks.length === 0) continue;

      // Generate vector embeddings for page chunks
      const chunksWithEmbeddings = await generateEmbeddings(pageChunks, apiKey, 20);

      // Save to PostgreSQL pgvector (upserts by pageUrl)
      const count = await repository.savePageChunks(page.url, chunksWithEmbeddings);
      totalSavedChunks += count;
    }

    const totalSeconds = Math.round((Date.now() - startTime) / 1000);

    console.log('\n========================================');
    console.log('🎉 Knowledge Base Generation Completed!');
    console.log('========================================');
    console.log(`Pages Processed : ${pages.length}`);
    console.log(`Chunks Stored   : ${totalSavedChunks}`);
    console.log(`Total Time      : ${totalSeconds} seconds\n`);
  } catch (error) {
    console.error('\n❌ Knowledge Base Generation Failed:', error);
    process.exit(1);
  } finally {
    await repository.disconnect();
  }
}

main();
