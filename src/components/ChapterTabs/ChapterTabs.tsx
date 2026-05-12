import { NavLink } from 'react-router-dom'
import type { Chapter } from '../../chapters/registry'
import styles from './ChapterTabs.module.scss'

type ChapterTabsProps = {
  chapters: Chapter[]
  placement?: 'top' | 'bottom'
  className?: string
}

export function ChapterTabs({
  chapters,
  placement = 'top',
  className,
}: ChapterTabsProps) {
  const isBottom = placement === 'bottom'

  return (
    <div
      className={[styles.root, isBottom ? styles.bottom : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label={isBottom ? 'Главы внизу страницы' : 'Главы'}
    >
      {chapters.map((c) => (
        <NavLink
          key={c.slug}
          to={`/read/${c.slug}`}
          role="tab"
          className={({ isActive }) =>
            [styles.tab, isActive ? styles.active : ''].join(' ')
          }
        >
          {c.title}
        </NavLink>
      ))}
    </div>
  )
}
