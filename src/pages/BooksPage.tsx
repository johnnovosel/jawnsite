import { useState } from 'react'
import BookTable from '../components/BookTable'
import SearchBar from '../components/SearchBar'
import AddBookForm from '../components/AddBookForm'
import { useBooks } from '../hooks/useBooks'
import styles from '../components/book.module.css'
import type { SortField, SortOrder, StatusFilter } from '../types/book'

const columns: { label: string; accessor: SortField }[] = [
  { label: 'Title', accessor: 'title' },
  { label: 'Author', accessor: 'author' },
]

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'owned', label: 'Owned' },
  { value: 'loaned', label: 'Loaned' },
]

export default function BooksPage() {
  const { books, addBook, removeBook, isDuplicate } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('author')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [adding, setAdding] = useState(false)

  const handleSorting = (field: SortField) => {
    const nextOrder: SortOrder =
      field === sortField && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(nextOrder)
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <button type="button" className={styles.addBookButton} onClick={() => setAdding(true)}>
          + Add book
        </button>
      </div>
      <div className={styles.filterRow}>
        <div className={styles.segmented} role="group" aria-label="Filter by status">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={statusFilter === value ? styles.segActive : styles.seg}
              aria-pressed={statusFilter === value}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className={styles.count}>
          {books.length} books · {books.filter((b) => b.isLoaned).length} loaned
        </p>
      </div>
      <BookTable
        books={books}
        columns={columns}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSorting}
        onRemove={removeBook}
      />
      <AddBookForm
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={addBook}
        isDuplicate={isDuplicate}
      />
    </div>
  )
}
