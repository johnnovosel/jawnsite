import { useMemo } from 'react'
import BookTableHead from './BookTableHead'
import BookTableBody from './BookTableBody'
import type { Book, SortField, SortOrder } from '../types/book'

interface BookTableProps {
  books: Book[]
  columns: { label: string; accessor: SortField }[]
  searchTerm: string
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

// Sort by author surname (last whitespace-separated token) when sorting by
// author, otherwise by the raw field value.
function sortKey(book: Book, field: SortField): string {
  const value = book[field]
  return field === 'author' ? value.split(' ').pop() ?? value : value
}

export default function BookTable({
  books,
  columns,
  searchTerm,
  sortField,
  sortOrder,
  onSort,
}: BookTableProps) {
  // Derive the visible rows from props — never mutate `books`, never copy it
  // into state. Recomputes only when an input actually changes.
  const rows = useMemo(() => {
    const term = searchTerm.toLowerCase()
    const direction = sortOrder === 'asc' ? 1 : -1

    return books
      .filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term),
      )
      .sort(
        (a, b) =>
          sortKey(a, sortField).localeCompare(sortKey(b, sortField), 'en', {
            numeric: true,
          }) * direction,
      )
  }, [books, searchTerm, sortField, sortOrder])

  return (
    <table>
      <BookTableHead
        columns={columns}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
      />
      <BookTableBody columns={columns} tableData={rows} />
    </table>
  )
}
