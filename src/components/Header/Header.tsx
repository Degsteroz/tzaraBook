import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Header.module.scss'

export function Header() {
  const { pathname } = useLocation()
  const bookActive = pathname === '/' || pathname.startsWith('/read')

  return (
    <header className={styles.root}>
      <span className={styles.brand}>TzaraBook</span>
      <nav className={styles.nav} aria-label="Основная навигация">
        <Link
          to="/"
          className={[styles.link, bookActive ? styles.active : ''].join(' ')}
        >
          Книга
        </Link>
        <NavLink
          to="/about-book"
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          О книге
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          О проекте
        </NavLink>
      </nav>
    </header>
  )
}
