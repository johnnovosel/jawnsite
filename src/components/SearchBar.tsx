import styles from './book.module.css'

interface SearchBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export default function SearchBar({ searchTerm, onSearchTermChange }: SearchBarProps) {
  return (
    <form className={styles.searchbar} role="search" onSubmit={(e) => e.preventDefault()}>
      <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        aria-label="Search books"
        placeholder="Search by title or author..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </form>
  )
}
