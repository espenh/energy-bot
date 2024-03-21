import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getDocument, version } from "pdfjs-dist";
import { getPineconeClient, getPineconeVariables } from '~/utils/pineconeClient';
import fs from "fs";

// This script ingests all pdfs in the docs folder into Pinecone.

const docsFolder = 'docs';

export const run = async () => {
  try {
    // Check that the docs folder exists.
    const fullDocsFolderPath = `${process.cwd()}/${docsFolder}`;
    if (!fs.existsSync(fullDocsFolderPath)) {
      throw new Error('The directory does not exist: ' + fullDocsFolderPath);
    }

    // Load all pdfs in the docs folder.
    const directoryLoader = new DirectoryLoader(docsFolder, {
      '.pdf': (path) => new PDFLoader(path, {
        pdfjs: async () => {
          return {
            getDocument, version
          }
        }
      }),
    });

    console.log("Loading pdfs")
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 400,
    });

    console.log("Splitting documents")
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Embed the documents.
    const embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
      dimensions: 1024,
    });

    const pinecone = await getPineconeClient()
    const { indexName, namespace } = getPineconeVariables()
    const index = pinecone.Index(indexName);

    // Ingest the documents into Pinecone.
    console.log("Ingesting documents into Pinecone")
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespace,
      textKey: 'text',
    });

  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('Ingestion complete');
})();
