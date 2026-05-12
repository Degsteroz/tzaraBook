import { useEffect, useState } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import type { Bookmark } from '../bookmarks/bookmarksStorage'
import { createBookmark } from '../bookmarks/bookmarksStorage'
import { ChapterNavRow } from '../components/ChapterNavRow/ChapterNavRow'
import { Hero } from '../components/Hero/Hero'
import { PaginatedReader } from '../components/PaginatedReader/PaginatedReader'
import type { Chapter } from '../chapters/registry'
import {
  getChapterBySlug,
  getChapters,
  getDefaultChapterSlug,
} from '../chapters/registry'
import { useBookmarks } from '../context/useBookmarks'
import { useMarkdownPages } from '../hooks/useMarkdownPages'
import styles from './BookPage.module.scss'

const FONT_MIN = 14
const FONT_MAX = 28

function clampFont(v: number) {
  return Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(v)))
}

function readInitialPageIndex(search: string, maxPage: number): number {
  const cap = Math.max(0, maxPage)
  const ps = new URLSearchParams(search).get('p')
  if (ps === null || ps === '') return 0
  const raw = Number(ps)
  if (!Number.isFinite(raw) || raw < 0) return 0
  return Math.min(Math.floor(raw), cap)
}

type BookChapterViewProps = {
  chapter: Chapter
  chapters: Chapter[]
  fontSizePx: number
  onFontSizeChange: (n: number) => void
  onOpenBookmark: (b: Bookmark) => void
}

function BookChapterView({
  chapter,
  chapters,
  fontSizePx,
  onFontSizeChange,
  onOpenBookmark,
}: BookChapterViewProps) {
  const { addBookmark } = useBookmarks()
  const location = useLocation()
  const navigate = useNavigate()
  const { pages } = useMarkdownPages(chapter.source, fontSizePx)

  const maxPage = Math.max(0, pages.length - 1)
  const [pageIndex, setPageIndex] = useState(() =>
    readInitialPageIndex(location.search, maxPage),
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ps = params.get('p')
    if (ps === null || ps === '') return
    const raw = Number(ps)
    if (!Number.isFinite(raw) || raw < 0) return
    // Синхронизация номера страницы из ?p= после перехода по закладке (не дублируем в рендере).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- намеренно применяем query из URL
    setPageIndex(Math.min(Math.floor(raw), maxPage))
    params.delete('p')
    const qs = params.toString()
    navigate(
      { pathname: location.pathname, search: qs ? `?${qs}` : '' },
      { replace: true },
    )
  }, [location.search, maxPage, navigate, location.pathname])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pageIndex])

  const safeIndex = Math.min(pageIndex, maxPage)
  const showHero = safeIndex === 0

  const handleSaveBookmark = () => {
    addBookmark(
      createBookmark({
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title,
        pageIndex: safeIndex,
        fontSizePx,
      }),
    )
  }

  return (
    <>
      {showHero ? <Hero /> : null}
      <ChapterNavRow chapters={chapters} onOpenBookmark={onOpenBookmark} />
      <div className={styles.book}>
        <PaginatedReader
          chapters={chapters}
          pages={pages}
          pageIndex={pageIndex}
          onPageIndexChange={setPageIndex}
          fontSizePx={fontSizePx}
          onFontSizeChange={onFontSizeChange}
          onSaveBookmark={handleSaveBookmark}
        />
      </div>
    </>
  )
}

export function BookPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const chapters = getChapters()
  const defaultSlug = getDefaultChapterSlug()
  const chapter = slug ? getChapterBySlug(slug) : undefined
  const [fontSizePx, setFontSizePx] = useState(17)

  const handleOpenBookmark = (b: Bookmark) => {
    setFontSizePx(clampFont(b.fontSizePx))
    navigate(`/read/${b.chapterSlug}?p=${b.pageIndex}`)
  }

  if (!slug || !chapter) {
    return <Navigate to={`/read/${defaultSlug}`} replace />
  }

  return (
    <div className={styles.root}>
      <BookChapterView
        key={slug}
        chapter={chapter}
        chapters={chapters}
        fontSizePx={fontSizePx}
        onFontSizeChange={setFontSizePx}
        onOpenBookmark={handleOpenBookmark}
      />
    </div>
  )
}
