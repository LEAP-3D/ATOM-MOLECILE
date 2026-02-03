/**
 * ЗӨВХӨН PINECONE - AI ХЭРЭГГҮЙ!
 * 
 * Энгийн математик аргаар embedding үүсгэнэ.
 * Semantic search ажиллахгүй, гэхдээ exact match болон
 * character similarity-аар хайлт хийх боломжтой.
 */

/**
 * Excel row-г текст болгох
 */
export function rowToText(row: Record<string, unknown>): string {
  return Object.entries(row)
    .map(([key, value]) => `${key}: ${String(value)}`)  // String() руу шууд convert
    .join(', ');
}

/**
 * Текстийг vector болгох - ЭНГИЙН МАТЕМАТИК
 * AI огт хэрэггүй, 100% үнэгүй
 */
export function getEmbedding(text: string): number[] {
  const dimensions = 384; // Pinecone free tier dimension
  const embedding = new Array(dimensions).fill(0);
  
  // Текстийн character-үүдийн давтамж тооцоолох
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = charCode % dimensions;
    embedding[index] += 1;
  }
  
  // Normalize (vector magnitude = 1 болгох)
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  
  if (magnitude === 0) {
    return embedding;
  }
  
  return embedding.map(val => val / magnitude);
}

/**
 * Нэмэлт: Hash-based embedding (илүү сайн)
 */
export function getHashEmbedding(text: string): number[] {
  const dimensions = 384;
  const embedding = new Array(dimensions).fill(0);
  
  // Үг бүрт hash хийх
  const words = text.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Hash-ыг dimension-д тохируулах
    const index = Math.abs(hash) % dimensions;
    embedding[index] += 1;
  }
  
  // Normalize
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  
  return embedding.map(val => val / (magnitude || 1));
}

/**
 * Хоёр текстийн ижил төстэй байдлыг тооцоолох
 * (хайлт хийхэд ашиглана)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
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