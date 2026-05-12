import { Link } from 'react-router-dom'
import { getDefaultChapterSlug } from '../chapters/registry'
import styles from './AboutBookPage.module.scss'

const COVER_IMAGE =
  'https://panels.twitch.tv/panel-253353658-image-7e6dd382-3f4a-40cd-a176-8b51ecee24e9'

export function AboutBookPage() {
  const slug = getDefaultChapterSlug()

  return (
    <article className={styles.root}>
      <h1 className={styles.title}>О книге</h1>

      <figure className={styles.figure}>
        <img
          src={COVER_IMAGE}
          alt="Иллюстрация: лисица из королевского дома в суровом фэнтези-сеттинге"
          className={styles.cover}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className={styles.blurb}>
        <p>
          Когда-то драконий лорд был запечатан в кольцах, и мир Аммайи выстоял
          ценой чужой головы. Теперь печати трещат, а Некрополис чувствует запах
          скола. Веосия и Драспар не готовы объединиться, даже когда враг стоит
          на пороге их дома. Лисица из королевского дома слышит шёпот чужой
          крови — древний, как скалы, и требовательный, как меч. Восстание и
          месть зовёт её по имени, а рядом идёт спутник, для которого она —
          лишь сосуд свободы. Судьбы стран, легенды и личные тайны переплетутся в
          узел, который можно развязать только зубами. Сняв петлю у шеи, кого
          она отпустит на волю — себя, континент или старое зло?
        </p>
      </div>

      <section className={styles.author} aria-labelledby="author-heading">
        <h2 id="author-heading" className={styles.subtitle}>
          Об авторе
        </h2>
        <p className={styles.placeholder}>
          Информация об авторе появится позже.
        </p>
      </section>

      <p className={styles.footer}>
        <Link className={styles.link} to={`/read/${slug}`}>
          К чтению глав
        </Link>
      </p>
    </article>
  )
}
