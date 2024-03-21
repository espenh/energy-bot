import { ChatMessage } from "~/contracts/chatContracts";
import { create } from "zustand"

export interface ChatStoreState {
    messages: ChatMessage[]
    isAssistantTyping: boolean
}

export interface ChatStoreActions {
    addMessage: (message: ChatMessage) => void
    setIsAssistantTyping: (isTyping: boolean) => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set) => ({
    messages: [],
    isAssistantTyping: false,
    addMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message]
        }))
    },
    setIsAssistantTyping: (isTyping) => {
        set((state) => ({
            isAssistantTyping: isTyping
        }))
    }
}))
