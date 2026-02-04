
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

export const getPineconeIndex = () => {
  const indexName = process.env.PINECONE_INDEX_NAME || 'user-data';
  return pinecone.index(indexName);
};

export const getPineconeIndexHost = async () => {
  const indexName = process.env.PINECONE_INDEX_NAME || 'user-data';
  const indexesList = await pinecone.listIndexes();
  const indexInfo = indexesList.indexes?.find(idx => idx.name === indexName);
  
  if (!indexInfo || !indexInfo.host) {
    throw new Error(`Index "${indexName}" олдсонгүй`);
  }
  
  return indexInfo.host;
};

export default pinecone;