import { useMemo } from 'react'
import { getCharsPerPage, paginateMarkdownByCharacters } from '../chapters/registry'

export function useMarkdownPages(
  source: string,
  fontSizePx: number,
): { pages: string[] } {
  const maxChars = getCharsPerPage(fontSizePx)

  return useMemo(
    () => ({
      pages: paginateMarkdownByCharacters(source, maxChars),
    }),
    [source, maxChars],
  )
}
