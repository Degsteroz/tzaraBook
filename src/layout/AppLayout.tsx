import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import styles from './AppLayout.module.scss'

export function AppLayout() {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
