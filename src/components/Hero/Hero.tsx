import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.root} aria-label="Обложка">
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.kicker}>Хроника пепла и чешуи</p>
        <h1 className={styles.title}>Книга драконов</h1>
        <p className={styles.sub}>
          Тёмное фэнтези · читайте главы ниже · изображение героя можно заменить
          позже
        </p>
      </div>
    </section>
  )
}
