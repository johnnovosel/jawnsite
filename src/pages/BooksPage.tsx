import { useCallback, useState } from 'react'
import BookTable from '../components/BookTable'
import BookDetail from '../components/BookDetail'
import SearchBar from '../components/SearchBar'
import BookForm from '../components/AddBookForm'
import { useBooks, type SyncStatus } from '../hooks/useBooks'
import styles from '../components/book.module.css'
import type { ReadFilter, SortField, SortOrder, StatusFilter } from '../types/book'

const columns: { label: string; accessor: SortField }[] = [
  { label: 'Title', accessor: 'title' },
  { label: 'Author', accessor: 'author' },
]

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'owned', label: 'Owned' },
  { value: 'loaned', label: 'Loaned' },
]

const readFilters: { value: ReadFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'read', label: 'Read' },
  { value: 'unread', label: 'Unread' },
]

const syncLabels: Record<SyncStatus, string> = {
  loading: 'Syncing…',
  saving: 'Saving…',
  synced: 'Saved on all devices',
  offline: 'Saved on this device only',
}

export default function BooksPage() {
  const { books, addBook, updateBook, removeBook, isDuplicate, status } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('author')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [readFilter, setReadFilter] = useState<ReadFilter>('any')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [selectedId, setSelectedId] = useState<number | undefined>()

  const selected = books.find((b) => b.id === selectedId)
  const closeDetail = useCallback(() => setSelectedId(undefined), [])

  const handleSorting = (field: SortField) => {
    const nextOrder: SortOrder =
      field === sortField && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(nextOrder)
  }

  const openAdd = () => {
    setEditing(false)
    setFormOpen(true)
  }

  return (
    <div className={selected ? styles.splitOpen : styles.split}>
      <div className={styles.listCol}>
        <div className={styles.toolbar}>
          <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          <button type="button" className={styles.addBookButton} onClick={openAdd}>
            + Add book
          </button>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterGroups}>
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
            <div className={styles.segmented} role="group" aria-label="Filter by read status">
              {readFilters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={readFilter === value ? styles.segActive : styles.seg}
                  aria-pressed={readFilter === value}
                  onClick={() => setReadFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className={styles.count}>
            {books.length} books · {books.filter((b) => b.isLoaned).length} loaned ·{' '}
            {books.filter((b) => b.isRead).length} read
            <span className={styles.sync} data-status={status}> · {syncLabels[status]}</span>
          </p>
        </div>
        <BookTable
          books={books}
          columns={columns}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          readFilter={readFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          selectedId={selectedId}
          onSort={handleSorting}
          onSelect={setSelectedId}
        />
      </div>

      {selected && (
        <BookDetail
          book={selected}
          books={books}
          onClose={closeDetail}
          onSelect={setSelectedId}
          onUpdate={updateBook}
          onEdit={() => {
            setEditing(true)
            setFormOpen(true)
          }}
          onDelete={() => {
            removeBook(selected.id)
            closeDetail()
          }}
        />
      )}

      <BookForm
        open={formOpen}
        book={editing ? selected : undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={(fields) => {
          if (editing && selected) updateBook(selected.id, fields)
          else addBook(fields)
        }}
        isDuplicate={isDuplicate}
      />
    </div>
  )
}
