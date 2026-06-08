import heroImage from '../../assets/hero.png'
import titleImage from '../../assets/title.png'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.root} aria-label="Обложка">
      <img src={heroImage} alt="" className={styles.heroImage} />
      <img
        src={titleImage}
        alt="Охота на Лисицу"
        className={styles.titleImage}
      />
    </section>
  )
}
