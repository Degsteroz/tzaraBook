import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadBookmarks,
  persistBookmarks,
  type Bookmark,
} from '../bookmarks/bookmarksStorage'
import { BookmarksContext } from './bookmarksContext'

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => loadBookmarks())

  const addBookmark = useCallback((b: Bookmark) => {
    setBookmarks((prev) => {
      const next = [...prev, b]
      persistBookmarks(next)
      return next
    })
  }, [])

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id)
      persistBookmarks(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      bookmarks,
      addBookmark,
      removeBookmark,
    }),
    [bookmarks, addBookmark, removeBookmark],
  )

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  )
}
