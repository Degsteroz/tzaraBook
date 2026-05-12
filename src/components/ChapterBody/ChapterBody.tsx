import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import styles from './ChapterBody.module.scss'

type ChapterBodyProps = {
  markdown: string
  className?: string
}

const markdownComponents: Components = {
  img(props) {
    const { node, className, ...rest } = props
    void node
    return (
      <img
        {...rest}
        className={['bookFloatFigure', className].filter(Boolean).join(' ')}
      />
    )
  },
}

export function ChapterBody({ markdown, className }: ChapterBodyProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
