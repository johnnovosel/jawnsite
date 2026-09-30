import { useState } from 'react'
import BookTable from '../components/BookTable'
import SearchBar from '../components/SearchBar'
import booksData from '../data/all-books.json'
import type { Book, SortField, SortOrder } from '../types/book'

const columns: { label: string; accessor: SortField }[] = [
  { label: 'Title', accessor: 'title' },
  { label: 'Author', accessor: 'author' },
]

// Static data bundled at build time — no server or fetch needed.
const books = booksData as Book[]

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('author')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSorting = (field: SortField) => {
    const nextOrder: SortOrder =
      field === sortField && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(nextOrder)
  }

  return (
    <div>
      <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <BookTable
        books={books}
        columns={columns}
        searchTerm={searchTerm}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSorting}
      />
    </div>
  )
}
