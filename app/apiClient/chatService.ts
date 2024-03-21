import { ChatRequest, ChatResponse } from "~/contracts/chatContracts";
import { useChatStore } from "~/stores/chatStore";

export async function askAssistant(question: string) {
    useChatStore.getState().addMessage({
        source: "user",
        text: question
    })

    const history = useChatStore.getState().messages;
    const chatRequest: ChatRequest = {
        question,
        history: history.map((message) => {
            if (message.source === "assistant") {
                return [message.source, message.response.text]
            }

            return [message.source, message.text]
        })
    }

    try {
        useChatStore.getState().setIsAssistantTyping(true)
        const requestResult = await runAssistantRequest(chatRequest)

        if (requestResult.type === "success") {
            useChatStore.getState().addMessage({
                source: "assistant",
                response: requestResult.response
            })
        } else {
            console.error(requestResult.error)
        }
    } finally {
        useChatStore.getState().setIsAssistantTyping(false)
    }
}

async function runAssistantRequest(request: ChatRequest): Promise<AssistantRequestResult> {
    const data = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })

    try {
        const jsonData = await data.json() as ChatResponse
        return {
            type: "success",
            response: jsonData
        }
    } catch (error: unknown) {
        return {
            type: "failure",
            error: error as Error
        }
    }
}

interface AssistantRequestSuccess {
    type: "success"
    response: ChatResponse
}

interface AssistantRequestFailure {
    type: "failure"
    error: Error
}

export type AssistantRequestResult = AssistantRequestSuccess | AssistantRequestFailure