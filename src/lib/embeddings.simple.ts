// lib/embeddings.simple.ts

export function rowToText(row: Record<string, unknown>): string {
  return Object.entries(row)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(', ');
}

export function getHashEmbedding(text: string): number[] {
  const dimensions = 384;
  const embedding = new Array(dimensions).fill(0);
  
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  for (const word of words) {
    // Hash 1: Үгийн hash
    let hash1 = 0;
    for (let i = 0; i < word.length; i++) {
      hash1 = ((hash1 << 5) - hash1) + word.charCodeAt(i);
      hash1 = hash1 & hash1; // 32-bit integer
    }
    
    const index1 = Math.abs(hash1) % dimensions;
    embedding[index1] += 1;
    
    // Hash 2: Bigrams (сүүлийн тэмдэгт хүртэл)
    for (let i = 0; i <= word.length - 2; i++) {
      const bigram = word.substring(i, i + 2);
      let hash2 = 0;
      for (let j = 0; j < bigram.length; j++) {
        hash2 = ((hash2 << 3) - hash2) + bigram.charCodeAt(j);
        hash2 = hash2 & hash2;
      }
      const index2 = Math.abs(hash2) % dimensions;
      embedding[index2] += 0.5;
    }
  }
  
  // Normalize - чухал!
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  
  if (magnitude === 0) return embedding; // Хоосон текст
  
  return embedding.map(val => val / magnitude);
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error(`Vector dimension mismatch: ${vec1.length} vs ${vec2.length}`);
  }
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Legacy function - deprecated
export function getEmbedding(text: string): number[] {
  console.warn("⚠️ getEmbedding устарсан, getHashEmbedding ашиглаарай");
  return getHashEmbedding(text);
}