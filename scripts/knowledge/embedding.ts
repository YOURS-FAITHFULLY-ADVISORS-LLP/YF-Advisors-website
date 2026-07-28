import { TextChunk, ChunkWithEmbedding, MistralEmbeddingResponse } from './types';

const MISTRAL_EMBED_URL = 'https://api.mistral.ai/v1/embeddings';

/**
 * Generates vector embeddings for a list of text chunks using Mistral Embeddings API.
 */
export async function generateEmbeddings(
  chunks: TextChunk[],
  apiKey: string,
  batchSize = 20
): Promise<ChunkWithEmbedding[]> {
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY environment variable is not defined.');
  }

  if (chunks.length === 0) return [];

  const results: ChunkWithEmbedding[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const inputs = batch.map((c) => c.content);

    let attempts = 0;
    let success = false;
    let embeddingsBatch: number[][] = [];

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const response = await fetch(MISTRAL_EMBED_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'mistral-embed',
            input: inputs,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Mistral API Error (${response.status}): ${errText}`);
        }

        const json = (await response.json()) as MistralEmbeddingResponse;
        embeddingsBatch = json.data.map((d) => d.embedding);
        success = true;
      } catch (err) {
        if (attempts >= 3) {
          throw err;
        }
        // Exponential backoff delay
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    batch.forEach((chunk, index) => {
      results.push({
        ...chunk,
        embedding: embeddingsBatch[index],
      });
    });
  }

  return results;
}

/**
 * Generates a single vector embedding for a query string.
 */
export async function generateSingleEmbedding(
  query: string,
  apiKey: string
): Promise<number[]> {
  const chunks: TextChunk[] = [
    {
      pageUrl: '',
      pageTitle: '',
      chunkIndex: 0,
      content: query,
    },
  ];

  const res = await generateEmbeddings(chunks, apiKey, 1);
  return res[0].embedding;
}
