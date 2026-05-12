export type Chapter = {
  slug: string
  title: string
  source: string
  sortKey: string
}

const rawModules = import.meta.glob<string>('./*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const BLOCK_JOIN = '\n\n'

function parseTitle(md: string): string {
  const m = md.match(/^#\s+(.+)$/m)
  return m?.[1]?.trim() ?? 'Глава'
}

function slugFromPath(path: string): string {
  const base = path.split('/').pop() ?? path
  return base.replace(/\.md$/i, '')
}

export function getChapters(): Chapter[] {
  return Object.entries(rawModules)
    .map(([path, source]) => {
      const slug = slugFromPath(path)
      return {
        sortKey: slug,
        slug,
        title: parseTitle(source),
        source,
      }
    })
    .sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true }),
    )
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return getChapters().find((c) => c.slug === slug)
}

export function getDefaultChapterSlug(): string {
  const list = getChapters()
  return list[0]?.slug ?? ''
}

export function splitMarkdownBlocks(md: string): string[] {
  return md
    .trim()
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
}

function splitOversizedBlock(block: string, maxChars: number): string[] {
  if (block.length <= maxChars) return [block]
  const parts: string[] = []
  let rest = block
  while (rest.length > maxChars) {
    let cut = rest.lastIndexOf(' ', maxChars)
    if (cut <= maxChars * 0.35) cut = maxChars
    const piece = rest.slice(0, cut).trim()
    if (piece) parts.push(piece)
    rest = rest.slice(cut).trim()
  }
  if (rest) parts.push(rest)
  return parts
}

/** Порядок величины одной книжной страницы (~2–2.5k знаков при 17px); кегль больше — чуть меньше знаков. */
export function getCharsPerPage(fontSizePx: number): number {
  const base = 2200
  const scaled = Math.round((base * 17) / Math.max(fontSizePx, 12))
  return Math.min(3200, Math.max(1400, scaled))
}

/**
 * Страницы по количеству символов: склеиваем целые абзацы (`\n\n`), один огромный абзац режем по пробелам.
 */
export function paginateMarkdownByCharacters(
  source: string,
  maxCharsPerPage: number,
): string[] {
  const trimmed = source.trim()
  if (!trimmed) return ['']

  const blocks = splitMarkdownBlocks(source)
  if (blocks.length === 0) return [trimmed]

  const pages: string[] = []
  let buf: string[] = []
  let len = 0

  const flush = () => {
    if (buf.length > 0) {
      pages.push(buf.join(BLOCK_JOIN))
      buf = []
      len = 0
    }
  }

  for (const block of blocks) {
    if (block.length > maxCharsPerPage) {
      flush()
      for (const piece of splitOversizedBlock(block, maxCharsPerPage)) {
        pages.push(piece)
      }
      continue
    }

    let joinLen = buf.length > 0 ? BLOCK_JOIN.length : 0
    if (len + joinLen + block.length > maxCharsPerPage && buf.length > 0) {
      flush()
      joinLen = 0
    }

    buf.push(block)
    len += joinLen + block.length
  }

  flush()
  return pages.length > 0 ? pages : [trimmed]
}
