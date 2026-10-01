import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <NavLink to="/" className={styles.brand}>
            <span aria-hidden="true">📚</span> BookApp
          </NavLink>
          <nav className={styles.nav}>
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/books" className={linkClass}>Books</NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
