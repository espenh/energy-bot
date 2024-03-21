# energy-bot

A bot that can answer questions about different energy products.

It uses embeddings generated from a set of public domain pdf files (see `docs` folder), mostly from Statnett.

* Embeddings stored in [pinecone](https://www.pinecone.io/).
* Uses [langchain](https://github.com/langchain-ai/langchainjs) to bridge GPT-4 and vector database.
* A basic custom front-end with message viewer that supports markdown (render tables etc.).

![image](https://github.com/espenh/energy-bot/assets/973493/3972fbdf-ca40-46e6-a464-59ceabaf7e76)

## Development

Create a `.env` file based on `.env.example`.

To ingest the files into pinecone:
```sh
npm run ingest
```

To start the dev server:
```sh
npm run dev
```

Then open http://localhost:3000/.

## Things to try

- Replace pinecone with [chroma](https://github.com/chroma-core/chroma) hosted locally.
- Add support for other data file formats (html, txt, etc.).
- Try Retriever-Augmented Generation (RAG), enabling retrieval of data on-the-fly
  - Query a graph (Neo4j?) (generate queries)
  - Fetch documents from some document store (fetch blobs based on document metadata)
- Query over structured data. Can we add graph/somedb capability that's invoked when needed?
