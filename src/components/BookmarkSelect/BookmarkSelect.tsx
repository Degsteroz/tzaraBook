import { useEffect, useId, useRef, useState } from 'react'
import type { Bookmark } from '../../bookmarks/bookmarksStorage'
import { useBookmarks } from '../../context/useBookmarks'
import styles from './BookmarkSelect.module.scss'

type BookmarkSelectProps = {
  onOpen: (bookmark: Bookmark) => void
}

export function BookmarkSelect({ onOpen }: BookmarkSelectProps) {
  const { bookmarks, removeBookmark } = useBookmarks()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (bookmarks.length === 0) return null

  return (
    <div ref={rootRef} className={styles.root}>
      <span className={styles.label} id={`${listId}-label`}>
        Закладки
      </span>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${listId}-label`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.triggerText}>Открыть…</span>
          <span className={styles.chevron} aria-hidden>
            {open ? '▴' : '▾'}
          </span>
        </button>

        {open ? (
          <div
            id={listId}
            className={styles.panel}
            role="listbox"
            aria-label="Список закладок"
          >
            <ul className={styles.list}>
              {bookmarks.map((b) => (
                <li key={b.id} className={styles.item} role="none">
                  <button
                    type="button"
                    className={styles.openBtn}
                    role="option"
                    onClick={() => {
                      onOpen(b)
                      setOpen(false)
                    }}
                  >
                    {b.label}
                  </button>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    aria-label={`Удалить закладку: ${b.label}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeBookmark(b.id)
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
