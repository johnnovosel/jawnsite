import { useState } from 'react'
import './App.css'
import BOOKS from './books.json'

function SearchBar({ searchTerm, searchTermChange }) {

  return (
    <form className="searchbar">
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => searchTermChange(e.target.value)} />
    </form>
  )

}

function BookRow({ book }) {
  return (
    <tr>
      <td>{book.title}</td>
      <td>{book.author}</td>
    </tr>
  )
}

function BookTable({ books, searchTerm }) {
  const rows = [];

  books.forEach((book) => {
    if (book.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        book.author.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
      rows.push(
        <BookRow
          book={book}
        />
      );
    }
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Titty</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows
        ) : (
          <tr>
            <td colSpan={2} style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
              No books found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function FilterableBookList({ books }) {

  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        searchTermChange={setSearchTerm} />
      <BookTable
        books={books}
        searchTerm={searchTerm} />
    </div>
  )
}

export default function App() {

  return <FilterableBookList books={BOOKS} />
}
