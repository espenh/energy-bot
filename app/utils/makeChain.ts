import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import type { VectorStoreRetriever } from 'langchain/vectorstores/base';

const CONDENSE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

const QA_TEMPLATE = `You are an expert researcher. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.

You are an expert in electricity production and market-based power systems in Norway, where electricity production and trading is market-based, while grid operations are strictly regulated. 
You excel at collating data from different sources and producing clear and correct information.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>


Question: {question}
Helpful answer in markdown:`;


export const makeChain = (retriever: VectorStoreRetriever) => {
    // Define the prompt templates for the model.
    const condenseQuestionPrompt = ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
    const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

    const model = new ChatOpenAI({
        temperature: 0, // Increase this value to make the model more creative.
        modelName: 'gpt-4'
    });

    
    const standaloneQuestionChain = RunnableSequence.from([
        condenseQuestionPrompt,
        model,
        new StringOutputParser(),
    ]);

    // Retrieve documents based on a query, then format them.
    const retrievalChain = retriever.pipe(formatDocumentsAsString)

    // Generate an answer to the standalone question based on the chat history
    // and retrieved documents. Additionally, we return the source documents directly.
    const answerChain = RunnableSequence.from([
        {
            context: RunnableSequence.from([
                (input) => input.question,
                retrievalChain,
            ]),
            chat_history: (input) => input.chat_history,
            question: (input) => input.question,
        },
        answerPrompt,
        model,
        new StringOutputParser(),
    ]);

    // First generate a standalone question, then answer it based on
    // chat history and retrieved context documents.
    const conversationalRetrievalQAChain = RunnableSequence.from([
        {
            question: standaloneQuestionChain,
            chat_history: (input) => input.chat_history,
        },
        answerChain,
    ]);

    return conversationalRetrievalQAChain;
};
