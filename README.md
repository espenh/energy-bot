# energy-bot

A bot that can answer questions about different energy products.

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