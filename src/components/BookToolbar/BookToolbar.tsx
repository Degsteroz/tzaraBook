import styles from './BookToolbar.module.scss'

type BookToolbarProps = {
  fontSizePx: number
  onFontSizeChange: (next: number) => void
  pageIndex: number
  pageCount: number
  onPrevPage: () => void
  onNextPage: () => void
  placement?: 'top' | 'bottom'
  onSaveBookmark?: () => void
}

const MIN = 14
const MAX = 28

export function BookToolbar({
  fontSizePx,
  onFontSizeChange,
  pageIndex,
  pageCount,
  onPrevPage,
  onNextPage,
  placement = 'top',
  onSaveBookmark,
}: BookToolbarProps) {
  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, Math.round(v)))

  const isBottom = placement === 'bottom'

  return (
    <div
      className={[styles.root, isBottom ? styles.bottom : ''].join(' ')}
    >
      <div className={styles.group} aria-label="Размер текста">
        <span className={styles.label}>Кегль</span>
        <button
          type="button"
          className={styles.step}
          onClick={() => onFontSizeChange(clamp(fontSizePx - 1))}
          disabled={fontSizePx <= MIN}
          aria-label="Уменьшить размер текста"
        >
          −
        </button>
        <input
          className={styles.input}
          type="number"
          min={MIN}
          max={MAX}
          value={fontSizePx}
          onChange={(e) => {
            const n = Number(e.target.value)
            if (Number.isFinite(n)) onFontSizeChange(clamp(n))
          }}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
        />
        <button
          type="button"
          className={styles.step}
          onClick={() => onFontSizeChange(clamp(fontSizePx + 1))}
          disabled={fontSizePx >= MAX}
          aria-label="Увеличить размер текста"
        >
          +
        </button>
      </div>

      <div className={styles.group} aria-label="Страницы">
        <span className={styles.label}>
          Стр. {pageCount ? pageIndex + 1 : 0} / {pageCount}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onPrevPage}
          disabled={pageIndex <= 0}
        >
          Назад
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onNextPage}
          disabled={pageIndex >= pageCount - 1}
        >
          Вперёд
        </button>
        {onSaveBookmark ? (
          <button
            type="button"
            className={styles.bookmarkBtn}
            onClick={onSaveBookmark}
            aria-label="Сохранить закладку: текущая глава и страница"
          >
            Закладка
          </button>
        ) : null}
      </div>
    </div>
  )
}
