import { useState } from 'react'
import BookTable from '../components/BookTable'
import SearchBar from '../components/SearchBar'
import AddBookForm from '../components/AddBookForm'
import { useBooks } from '../hooks/useBooks'
import styles from '../components/book.module.css'
import type { SortField, SortOrder } from '../types/book'

const columns: { label: string; accessor: SortField }[] = [
  { label: 'Title', accessor: 'title' },
  { label: 'Author', accessor: 'author' },
]

export default function BooksPage() {
  const { books, addBook, removeBook, isDuplicate } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('author')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
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
      <p className={styles.count}>{books.length} books in the collection</p>
      <BookTable
        books={books}
        columns={columns}
        searchTerm={searchTerm}
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
