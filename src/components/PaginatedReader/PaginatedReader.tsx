import { BookToolbar } from '../BookToolbar/BookToolbar'
import { ChapterBody } from '../ChapterBody/ChapterBody'
import { ChapterTabs } from '../ChapterTabs/ChapterTabs'
import type { Chapter } from '../../chapters/registry'
import styles from './PaginatedReader.module.scss'

type PaginatedReaderProps = {
  chapters: Chapter[]
  pages: string[]
  pageIndex: number
  onPageIndexChange: (index: number) => void
  fontSizePx: number
  onFontSizeChange: (n: number) => void
  onSaveBookmark?: () => void
}

export function PaginatedReader({
  chapters,
  pages,
  pageIndex,
  onPageIndexChange,
  fontSizePx,
  onFontSizeChange,
  onSaveBookmark,
}: PaginatedReaderProps) {
  const pageCount = pages.length
  const maxPage = Math.max(0, pageCount - 1)
  const safeIndex = Math.min(pageIndex, maxPage)
  const currentMd = pages[safeIndex] ?? ''

  const goPrev = () => onPageIndexChange(Math.max(0, safeIndex - 1))

  const goNext = () => onPageIndexChange(Math.min(maxPage, safeIndex + 1))

  const toolbarProps = {
    fontSizePx,
    onFontSizeChange,
    pageIndex: safeIndex,
    pageCount,
    onPrevPage: goPrev,
    onNextPage: goNext,
    onSaveBookmark,
  }

  return (
    <div className={styles.root}>
      <BookToolbar {...toolbarProps} placement="top" />

      <div className={styles.reading}>
        <article
          className={styles.article}
          style={{ fontSize: `${fontSizePx}px` }}
        >
          <ChapterBody markdown={currentMd} />
        </article>
      </div>

      <ChapterTabs chapters={chapters} placement="bottom" />

      <BookToolbar {...toolbarProps} placement="bottom" />
    </div>
  )
}
