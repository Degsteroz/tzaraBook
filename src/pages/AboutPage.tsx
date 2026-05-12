import { Link } from 'react-router-dom'
import { getDefaultChapterSlug } from '../chapters/registry'
import styles from './AboutPage.module.scss'

export function AboutPage() {
  const slug = getDefaultChapterSlug()

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>О проекте</h1>
      <p className={styles.text}>
        TzaraBook — демонстрационное SPA на React и Vite: главы в Markdown,
        обтекание иллюстраций, кегль и постраничная подгонка по высоте области
        чтения.
      </p>
      <p className={styles.text}>
        Вернуться к{' '}
        <Link className={styles.link} to={`/read/${slug}`}>
          книге
        </Link>
        .
      </p>
    </section>
  )
}
