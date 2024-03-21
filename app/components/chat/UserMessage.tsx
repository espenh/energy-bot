import { PersonIcon } from '@radix-ui/react-icons';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import React from "react";
import { MarkdownView } from '~/components/MarkdownView';
import { UseChatMessage } from '~/contracts/chatContracts';


export const UserMessage: React.FC<{ message: UseChatMessage; }> = ({ message }) => {
  return <><Avatar size="1" fallback={<PersonIcon />} variant="soft" />
    <Flex direction="column">
      <Text size="1" weight="bold">You</Text>
      <MarkdownView markdown={message.text} />
    </Flex>
  </>;
};
