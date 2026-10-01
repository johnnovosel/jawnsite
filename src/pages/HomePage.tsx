import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Welcome to BookApp</h1>
      <p className={styles.tagline}>Do I have this book? Search the whole collection in seconds.</p>
      <Link to="/books" className={styles.ctabutton}>
        Browse the book list
      </Link>
    </section>
  )
}
