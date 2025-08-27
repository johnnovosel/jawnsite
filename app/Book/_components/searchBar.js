import styles from './book.module.css';

export default function SearchBar({ searchTerm, searchTermChange }) {

  return (
    <form className={styles.searchbar}>
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => searchTermChange(e.target.value)} />
    </form>
  )
}