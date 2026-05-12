import { createContext } from 'react'
import type { Bookmark } from '../bookmarks/bookmarksStorage'

export type BookmarksContextValue = {
  bookmarks: Bookmark[]
  addBookmark: (b: Bookmark) => void
  removeBookmark: (id: string) => void
}

export const BookmarksContext = createContext<BookmarksContextValue | null>(
  null,
)
