export interface ChatRequest {
    question: string;
    history: [string, string][];
}

export interface SourceDocument {
    metadata: SourceDocumentMetadata
    pageContent: string
}

export interface PdfSourceDocument extends SourceDocument {
    metadata: PdfSourceDocumentMetadata
}

export interface SourceDocumentMetadata {
    "loc.lines.from": number
    "loc.lines.to": number
    "loc.pageNumber": number
    source: string
}

export interface PdfSourceDocumentMetadata extends SourceDocumentMetadata {
    "pdf.info.Author": string
    "pdf.info.CreationDate": string
    "pdf.info.ModDate": string
    "pdf.info.Title": string
    "pdf.info.totalPages": number
}

export type User = "user"
export type Assistant = "assistant"

export type MessageSource = User | Assistant

export type ChatMessage = UseChatMessage | AssistantChatMessage

export interface UseChatMessage {
    source: User
    text: string
}

export interface AssistantChatMessage {
    source: Assistant
    response: ChatResponse
}

export interface ChatResponse {
    text: string,
    sourceDocuments: PdfSourceDocument[] // Just pdf for now, but this could be a more general type with a discriminative field, like "type: 'pdf'".
}