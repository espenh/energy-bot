import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ActionFunctionArgs, json } from "@remix-run/node";
import type { ChatRequest, PdfSourceDocument } from "~/contracts/chatContracts";
import { makeChain } from "~/utils/makeChain";
import { getPineconeClient, getPineconeVariables } from "~/utils/pineconeClient";

// API route to handle chat requests.

export async function action({
    request,
}: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return json({ error: 'Only POST requests are allowed' }, 405);
    }

    const { question, history } = (await request.json()) as ChatRequest;

    try {
        const pineconeVars = getPineconeVariables();
        const pinecone = await getPineconeClient();
        const index = pinecone.Index(pineconeVars.indexName);

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                modelName: 'text-embedding-3-large',
                dimensions: 1024,
            }),
            {
                pineconeIndex: index,
                textKey: 'text',
                namespace: pineconeVars.namespace,
            },
        );

        // Capture the retrieved source documents so we can return them in the response.
        let sourceDocuments: PdfSourceDocument[] = []
        const retriever = vectorStore.asRetriever({
            callbacks: [
                {
                    handleRetrieverEnd(documents) {
                        sourceDocuments = documents as PdfSourceDocument[]
                    },
                },
            ],
        });

        const chain = makeChain(retriever);

        const pastMessages = history
            .map((message: [string, string]) => {
                return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
            })
            .join('\n');

        const response = await chain.invoke({
            question: question,
            chat_history: pastMessages,
        });
        return json({ text: response, sourceDocuments }, 200);
    } catch (error: any) {
        return json({ error: error.message || 'Something went wrong' }, 500);
    }
}