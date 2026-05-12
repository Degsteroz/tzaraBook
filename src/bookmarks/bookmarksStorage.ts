export const BOOKMARKS_STORAGE_KEY = 'tzarabook:bookmarks'

export type Bookmark = {
  id: string
  chapterSlug: string
  pageIndex: number
  fontSizePx: number
  label: string
  createdAt: number
}

function safeParse(raw: string | null): Bookmark[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isBookmark)
  } catch {
    return []
  }
}

function isBookmark(x: unknown): x is Bookmark {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return (
    typeof b.id === 'string' &&
    typeof b.chapterSlug === 'string' &&
    typeof b.pageIndex === 'number' &&
    typeof b.fontSizePx === 'number' &&
    typeof b.label === 'string' &&
    typeof b.createdAt === 'number'
  )
}

export function loadBookmarks(): Bookmark[] {
  if (typeof localStorage === 'undefined') return []
  return safeParse(localStorage.getItem(BOOKMARKS_STORAGE_KEY))
}

export function persistBookmarks(bookmarks: Bookmark[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks))
}

export function makeBookmarkLabel(chapterTitle: string, pageIndex: number): string {
  return `${chapterTitle} — стр. ${pageIndex + 1}`
}

export function createBookmark(input: {
  chapterSlug: string
  chapterTitle: string
  pageIndex: number
  fontSizePx: number
}): Bookmark {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `bm-${Date.now()}`,
    chapterSlug: input.chapterSlug,
    pageIndex: input.pageIndex,
    fontSizePx: input.fontSizePx,
    label: makeBookmarkLabel(input.chapterTitle, input.pageIndex),
    createdAt: Date.now(),
  }
}
