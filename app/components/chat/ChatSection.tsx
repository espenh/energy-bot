import { Card, Flex } from '@radix-ui/themes';
import React from "react";
import { ChatMessage } from '~/contracts/chatContracts';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

export interface ChatSectionProps {
  message: ChatMessage
}

export const ChatSection: React.FC<ChatSectionProps> = ({ message }) => {
  return <Card>
    <Flex align="start" gap={"4"}>
      {message.source === "assistant" && <AssistantMessage message={message} />}
      {message.source === "user" && <UserMessage message={message} />}
    </Flex>
  </Card>;
};

