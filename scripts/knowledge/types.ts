export interface ScannedPage {
  url: string;
  title: string;
  category: 'static' | 'service' | 'blog' | 'other';
  rawText: string;
}

export interface TextChunk {
  pageUrl: string;
  pageTitle: string;
  chunkIndex: number;
  content: string;
}

export interface ChunkWithEmbedding extends TextChunk {
  embedding: number[];
}

export interface MistralEmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}
