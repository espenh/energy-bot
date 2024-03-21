import rehypeRaw from 'rehype-raw'
import remarkGfm from "remark-gfm"
import Markdown from 'react-markdown'

const pluginsToUse = [rehypeRaw, remarkGfm]

// Markdown viewer that supports GitHub Flavored Markdown,
// enabling tables and other things: https://github.github.com/gfm/.

export const MarkdownView: React.FC<{ markdown: string }> = ({ markdown }) => {
    return <Markdown rehypePlugins={pluginsToUse}>{markdown}</Markdown>
}