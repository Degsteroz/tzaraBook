#!/usr/bin/env node
/**
 * Конвертирует src/chapters/*.docx → .md + картинки в public/chapters/.
 * Требует: pandoc (brew install pandoc)
 *
 * Запуск: npm run convert:chapters
 */

import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CHAPTERS_DIR = join(ROOT, 'src/chapters')
const PUBLIC_MEDIA_ROOT = join(ROOT, 'public/chapters')

const CHAPTER_SOURCES = [
  { file: 'Глава 0.docx', prefix: '00', fallbackTitle: 'Глава 0. Предыстория' },
  { file: 'Глава 1.docx', prefix: '01', fallbackTitle: 'Глава 1. Детство' },
  { file: 'Глава 2.docx', prefix: '02', fallbackTitle: 'Глава 2. Обед' },
  { file: 'Глава 3.docx', prefix: '03', fallbackTitle: 'Глава 3. Урок магии' },
  { file: 'Глава 4.docx', prefix: '04', fallbackTitle: 'Глава 4. Бал' },
  { file: 'Глава 5.docx', prefix: '05', fallbackTitle: 'Глава 5. Кровное посвящение' },
  { file: 'Глава 6.docx', prefix: '06', fallbackTitle: 'Глава 6. Библиотека' },
  { file: 'Глава 7.docx', prefix: '07', fallbackTitle: 'Глава 7' },
  { file: 'Глава 8.docx', prefix: '08', fallbackTitle: 'Глава 8' },
  {
    file: 'Новогодний спешл.docx',
    prefix: '09',
    fallbackTitle: 'Новогодний спешл',
  },
]

const DEMO_CHAPTERS = ['01-dragons.md', '02-village.md']

const TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

function assertPandoc() {
  try {
    execFileSync('pandoc', ['--version'], { stdio: 'pipe' })
  } catch {
    console.error('Ошибка: pandoc не найден. Установите: brew install pandoc')
    process.exit(1)
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function extractTitle(md, fallback) {
  const chapterLine = md.match(/^Глава \d+(?:\.\s+.+)?$/m)
  if (chapterLine) return chapterLine[0].trim()

  const special = md.match(/^Новогодний спешл$/m)
  if (special) return special[0].trim()

  return fallback
}

function titleToSlug(title, prefix) {
  const chapter = title.match(/^Глава (\d+)(?:\.\s*(.+))?$/)
  if (chapter) {
    const subtitle = chapter[2]?.trim()
    if (subtitle) return slugify(subtitle)
    return `chapter-${chapter[1]}`
  }
  return slugify(title) || `chapter-${prefix}`
}

function removeTitleLine(md, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return md.replace(new RegExp(`^${escaped}\\s*\\n+`, 'm'), '').trim()
}

function fixEmDashes(text) {
  return text
    .replace(/ --- /g, ' — ')
    .replace(/^--- /gm, '— ')
    .replace(/ ---$/gm, ' —')
}

function fixPandocArtifacts(text) {
  return text
    .replace(/\{width="[^"]*"(?:\s+height="[^"]*")?\}/g, '')
    .replace(/\{\.underline\}/g, '')
    .replace(/\\\* \\\* \\\*/g, '* * *')
    .replace(/^\u00a0+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function flattenMediaDir(extractDir, targetDir) {
  mkdirSync(targetDir, { recursive: true })

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      const dest = join(targetDir, basename(full))
      copyFileSync(full, dest)
    }
  }

  if (existsSync(extractDir)) walk(extractDir)
}

function rewriteImagePaths(md, mediaSlug) {
  const webRoot = `/chapters/${mediaSlug}`

  return md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt, src) => {
      const fileName = basename(src.split('?')[0])
      const label = alt.trim() || 'Иллюстрация'
      return `![${label}](${webRoot}/${fileName})`
    },
  )
}

function convertOne({ file, prefix, fallbackTitle }) {
  const docxPath = join(CHAPTERS_DIR, file)
  if (!existsSync(docxPath)) {
    console.warn(`Пропуск: нет файла ${file}`)
    return null
  }

  const mediaSlug = `ch${prefix}`

  const tmpDir = join(ROOT, '.tmp/convert-chapters', prefix)
  const tmpMd = join(tmpDir, 'chapter.md')
  const tmpMedia = join(tmpDir, 'extract')

  rmSync(tmpDir, { recursive: true, force: true })
  mkdirSync(tmpDir, { recursive: true })

  execFileSync(
    'pandoc',
    [
      docxPath,
      '-o',
      tmpMd,
      `--extract-media=${tmpMedia}`,
      '--wrap=none',
      '--markdown-headings=atx',
    ],
    { stdio: 'pipe' },
  )

  let md = readFileSync(tmpMd, 'utf8')
  const resolvedTitle = extractTitle(md, fallbackTitle)
  const titleSlug = titleToSlug(resolvedTitle, prefix)
  const mdFileName = `${prefix}-${titleSlug}.md`
  const mdPath = join(CHAPTERS_DIR, mdFileName)

  md = removeTitleLine(md, resolvedTitle)
  md = fixEmDashes(md)
  md = fixPandocArtifacts(md)

  const publicMediaDir = join(PUBLIC_MEDIA_ROOT, mediaSlug)
  rmSync(publicMediaDir, { recursive: true, force: true })
  flattenMediaDir(tmpMedia, publicMediaDir)

  md = rewriteImagePaths(md, mediaSlug)
  const output = `# ${resolvedTitle}\n\n${md}\n`
  writeFileSync(mdPath, output, 'utf8')

  rmSync(tmpDir, { recursive: true, force: true })

  return { mdFileName, resolvedTitle, mediaSlug }
}

function removeDemoChapters() {
  for (const name of DEMO_CHAPTERS) {
    const path = join(CHAPTERS_DIR, name)
    if (existsSync(path)) {
      rmSync(path)
      console.log(`Удалена демо-глава: ${name}`)
    }
  }
}

assertPandoc()
mkdirSync(PUBLIC_MEDIA_ROOT, { recursive: true })

console.log('Конвертация docx → md...\n')

const results = []
for (const source of CHAPTER_SOURCES) {
  const result = convertOne(source)
  if (result) {
    results.push(result)
    console.log(`✓ ${source.file} → ${result.mdFileName}`)
  }
}

removeDemoChapters()

console.log(`\nГотово: ${results.length} глав.`)
console.log(`Картинки: public/chapters/ch*/`)
