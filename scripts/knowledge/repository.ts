import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ChunkWithEmbedding } from './types';

export function createPrismaInstance(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || '',
  });
  return new PrismaClient({ adapter });
}

export class KnowledgeRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || createPrismaInstance();
  }

  /**
   * Initializes PostgreSQL pgvector extension and creates knowledge_documents table if needed.
   */
  async initializeDatabase(): Promise<void> {
    try {
      // 1. Enable pgvector extension
      await this.prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

      // 2. Create knowledge_documents table if it doesn't exist
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS knowledge_documents (
          id VARCHAR(191) PRIMARY KEY,
          page_url TEXT NOT NULL,
          page_title TEXT NOT NULL,
          chunk_index INT NOT NULL,
          content TEXT NOT NULL,
          embedding vector(1024),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Create index for fast pageUrl deletion and lookup
      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS knowledge_documents_page_url_idx 
        ON knowledge_documents(page_url);
      `);

      // 4. Create vector index for fast similarity search
      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS knowledge_documents_embedding_idx 
        ON knowledge_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
      `).catch(() => {
        // Fallback if ivfflat requires table rows first
      });
    } catch (error) {
      console.warn('Note: PostgreSQL vector setup notification:', error);
    }
  }

  /**
   * Upserts page chunks for a given page URL (deletes old chunks first to avoid duplicates).
   */
  async savePageChunks(pageUrl: string, chunks: ChunkWithEmbedding[]): Promise<number> {
    if (chunks.length === 0) return 0;

    // 1. Delete existing chunks for pageUrl using raw SQL (safe regardless of Prisma model state)
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM knowledge_documents WHERE page_url = $1`,
      pageUrl
    );

    // 2. Insert new chunks with vector embedding
    let savedCount = 0;

    for (const chunk of chunks) {
      const vectorStr = `[${chunk.embedding.join(',')}]`;
      const docId = `kd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      await this.prisma.$executeRawUnsafe(
        `INSERT INTO knowledge_documents (id, page_url, page_title, chunk_index, content, embedding, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::vector, NOW(), NOW())`,
        docId,
        chunk.pageUrl,
        chunk.pageTitle,
        chunk.chunkIndex,
        chunk.content,
        vectorStr
      );

      savedCount++;
    }

    return savedCount;
  }

  /**
   * Searches knowledge documents by vector similarity using pgvector.
   */
  async searchSimilarChunks(
    queryEmbedding: number[],
    limit = 5
  ): Promise<Array<{ pageUrl: string; pageTitle: string; content: string; similarity: number }>> {
    const vectorStr = `[${queryEmbedding.join(',')}]`;

    const results = await this.prisma.$queryRawUnsafe<Array<{
      page_url: string;
      page_title: string;
      content: string;
      similarity: number;
    }>>(
      `SELECT page_url, page_title, content, (1 - (embedding <=> $1::vector)) AS similarity
       FROM knowledge_documents
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      vectorStr,
      limit
    );

    return results.map((r) => ({
      pageUrl: r.page_url,
      pageTitle: r.page_title,
      content: r.content,
      similarity: Number(r.similarity),
    }));
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
