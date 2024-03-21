import * as Accordion from "@radix-ui/react-accordion";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { MagicWandIcon } from '@radix-ui/react-icons';
import { Avatar, Blockquote, Box, Card, Code, Flex, Spinner, Text } from '@radix-ui/themes';
import React from "react";
import { MarkdownView } from '~/components/MarkdownView';
import { AssistantChatMessage, PdfSourceDocument } from '~/contracts/chatContracts';


export const AssistantMessage: React.FC<{ message: AssistantChatMessage; }> = ({ message }) => {
  const hasSources = message.source?.length > 0;

  return <><Avatar size="1" fallback={<MagicWandIcon />} variant="solid" />
    <Flex direction="column">
      <Text size="1" weight="bold">EnergyBot</Text>
      <MarkdownView markdown={message.response.text} />
      {hasSources && <AssistantSourceDeclaration sourceList={message.response.sourceDocuments} />}
    </Flex>
  </>;
};


const AssistantSourceDeclaration: React.FC<{ sourceList: PdfSourceDocument[] }> = ({ sourceList }) => {
  if (!sourceList || sourceList.length === 0) return null;

  return <Accordion.Root type="single" collapsible={true}>
    {sourceList.map((documentSource, index) => {
      // We can have multiple sources on the same file,
      // so let's just use the index as key.
      const key = index.toString();

      // The filename can be quite long, so we'll just show the last x characters.
      const sourceFile = documentSource.metadata.source.slice(-60);

      return <Accordion.Item key={key} value={key}>
        <AccordionTrigger>{sourceFile}</AccordionTrigger>
        <AccordionContent>
          <Box pl={"4"}>
            <div style={{ fontSize: "0.6em" }}>
              <Blockquote>
                <MarkdownView markdown={documentSource.pageContent} />
              </Blockquote>
            </div>
            <div style={{ fontSize: "0.5em" }}>
              <Code><pre>{JSON.stringify(documentSource.metadata, null, 2)}</pre></Code>
            </div>
          </Box>
        </AccordionContent>
      </Accordion.Item>
    })}
  </Accordion.Root>
}

export const AssistantThinkingMessage: React.FC = () => {
  return <Card>
    <Flex align="start" gap={"4"}>
      <><Avatar size="1" fallback={<MagicWandIcon />} variant="solid" />
        <Flex direction="column">
          <Text size="1" weight="bold">EnergyBot</Text>
          <Box pt="2">
            <Spinner size="2" />
          </Box>
        </Flex>
      </>
    </Flex>
  </Card>
}