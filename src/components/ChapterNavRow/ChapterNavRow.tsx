import type { Bookmark } from '../../bookmarks/bookmarksStorage'
import { ChapterTabs } from '../ChapterTabs/ChapterTabs'
import type { Chapter } from '../../chapters/registry'
import { BookmarkSelect } from '../BookmarkSelect/BookmarkSelect'
import styles from './ChapterNavRow.module.scss'

type ChapterNavRowProps = {
  chapters: Chapter[]
  onOpenBookmark: (b: Bookmark) => void
}

export function ChapterNavRow({ chapters, onOpenBookmark }: ChapterNavRowProps) {
  return (
    <div className={styles.root}>
      <div className={styles.tabs}>
        <ChapterTabs
          chapters={chapters}
          placement="top"
          className={styles.tabsInner}
        />
      </div>
      <BookmarkSelect onOpen={onOpenBookmark} />
    </div>
  )
}
