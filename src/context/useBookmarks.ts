import { useContext } from 'react'
import { BookmarksContext } from './bookmarksContext'

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) {
    throw new Error('useBookmarks must be used within BookmarksProvider')
  }
  return ctx
}
