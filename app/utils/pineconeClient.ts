import { Pinecone } from '@pinecone-database/pinecone';

async function initPinecone() {
  const { apiKey } = getPineconeVariables();

  try {
    const pinecone = new Pinecone({
      apiKey
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

let pineconeClient: Pinecone | null = null;

export async function getPineconeClient() {
  if (!pineconeClient) {
    pineconeClient = await initPinecone();
  }

  return pineconeClient;
}

export const getPineconeVariables = () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY not set.');
  }

  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error('PINECONE_INDEX_NAME not set.');
  }

  return {
    apiKey: process.env.PINECONE_API_KEY,
    indexName: process.env.PINECONE_INDEX_NAME,
    namespace: process.env.PINECONE_NAME_SPACE ?? 'docs',
  }
}