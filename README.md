# TzaraBook

SPA для чтения книги: главы в Markdown, навигация, кегль, «страницы» по объёму текста, закладки в браузере.

---

## Для автора книги

Вы разработчик, но с **веб-стеком и раскладкой этого репозитория** могли не работать — ниже только то, что нужно для текста книги и выкладки на прод.

### GitHub и редактор

- Вас добавляют **collaborator** в репозиторий на GitHub с правом пушить в прод-ветку (часто `main`).
- Удобный вариант: **Cursor** или **VS Code** — `git clone`, открыть корень репозитория. Редактирование файлов через веб-GitHub тоже ок, для длинных глав обычно приятнее локальный редактор.

### Где что лежит


| Что                  | Где                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Главы                | `[src/chapters/](src/chapters/)` — `*.md`, порядок вкладок по **имени файла** (`01-...`, `02-...`).    |
| Заголовок главы в UI | Первая строка файла: `# Заголовок`.                                                                    |
| Картинки в главе     | Файл в `[public/](public/)` (например `public/chapters/`), в тексте: `![подпись](/chapters/файл.png)`. |
| «О книге»            | Сейчас в `[src/pages/AboutBookPage.tsx](src/pages/AboutBookPage.tsx)`, не в Markdown.                  |


### Публикация

**Commit** и **push** в прод-ветку — из **Source Control** в редакторе или как привыкли из терминала. После push деплой (например **Vercel**) пересобирает сайт; через 1–3 минуты смысл проверять в браузере. При подозрении на кеш — жёсткое обновление (**Ctrl+F5** / **Cmd+Shift+R**).

**Vercel и email в коммите:** если сборка падает с текстом про несовпадение **email автора коммита** с GitHub — в `git config user.email` для этого репозитория должен быть адрес из вашего GitHub (удобно `**…@users.noreply.github.com`** из **Settings → Emails**). Это ограничение хостинга, не логики репозитория.

### Что видит читатель

- Вкладки глав, кегль, разбиение текста на «страницы» по **приблизительному числу символов** (не по высоте окна).
- **Закладки** — только в браузере (`localStorage`), из репозитория не конфигурируются.

---

## Для AI-агента (код и архитектура)

### Стек

- **React 19**, **TypeScript**, **Vite 8**
- **react-router-dom** — маршруты
- **sass** — стили в `*.module.scss`
- **react-markdown** + **remark-gfm** + **rehype-raw** — рендер Markdown (сырой HTML в md разрешён для особых вставок)

### Точки входа и маршруты

- `[src/main.tsx](src/main.tsx)` — `StrictMode`, `BrowserRouter`
- `[src/App.tsx](src/App.tsx)` — `BookmarksProvider`, `Routes`: `/` → редирект на `/read/:firstSlug`, `/read/:slug`, `/about-book`, `/about`
- `[src/layout/AppLayout.tsx](src/layout/AppLayout.tsx)` — шапка + `Outlet`

### Главы и пагинация

- `[src/chapters/registry.ts](src/chapters/registry.ts)` — `import.meta.glob('./*.md', { query: '?raw' })`, сортировка, `getChapters`, `getChapterBySlug`, `paginateMarkdownByCharacters`, `getCharsPerPage`
- `[src/hooks/useMarkdownPages.ts](src/hooks/useMarkdownPages.ts)` — `useMemo` над списком страниц из `paginateMarkdownByCharacters`
- `[src/pages/BookPage.tsx](src/pages/BookPage.tsx)` — `BookChapterView` с `key={slug}`, Hero только на первой «странице» текста, `ChapterNavRow`, `PaginatedReader`
- `[src/components/ChapterBody/ChapterBody.tsx](src/components/ChapterBody/ChapterBody.tsx)` — markdown; кастомный `components.img` вешает класс `bookFloatFigure` для обтекания (`[ChapterBody.module.scss](src/components/ChapterBody/ChapterBody.module.scss)`)

### Закладки

- `[src/bookmarks/bookmarksStorage.ts](src/bookmarks/bookmarksStorage.ts)` — ключ `tzarabook:bookmarks`, тип `Bookmark`, `loadBookmarks` / `persistBookmarks`
- `[src/context/BookmarksProvider.tsx](src/context/BookmarksProvider.tsx)`, `[src/context/useBookmarks.ts](src/context/useBookmarks.ts)`, `[src/context/bookmarksContext.ts](src/context/bookmarksContext.ts)`
- UI: `[src/components/BookmarkSelect/BookmarkSelect.tsx](src/components/BookmarkSelect/BookmarkSelect.tsx)`, навигация глав + закладки: `[src/components/ChapterNavRow/ChapterNavRow.tsx](src/components/ChapterNavRow/ChapterNavRow.tsx)`
- Открытие закладки: `navigate(/read/${slug}?p=${pageIndex})`, обработка в `BookPage` / `BookChapterView` (см. `[BookPage.tsx](src/pages/BookPage.tsx)`)

### Скрипты

- `npm run dev` — разработка
- `npm run build` — `tsc -b` + production-сборка
- `npm run lint` — ESLint
- `npm run preview` — превью production-билда

### Договорённости по правкам

- Не раздувать объём правок без запроса; стиль как в соседних файлах (импорты, SCSS-модули).
- Не коммитить секреты; переменные окружения — через `.env` / настройки хостинга, не в репозиторий.
- Статические ассеты для книги — под `[public/](public/)`; импортируемые из кода — под `[src/assets/](src/assets/)`.

