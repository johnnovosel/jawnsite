import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to BookApp</h1>

      <Link to="/books" className={styles.ctabutton}>
        CLICK HERE FOR BOOK LIST
      </Link>
    </div>
  )
}
