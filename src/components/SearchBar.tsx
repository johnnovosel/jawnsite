import styles from './book.module.css'

interface SearchBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export default function SearchBar({ searchTerm, onSearchTermChange }: SearchBarProps) {
  return (
    <form className={styles.searchbar} role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        aria-label="Search books"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </form>
  )
}
