'use client'

import React from 'react';
import styles from './_components/book.module.css';
import BOOKS from './_data/all-books.json'
import BookTable from './_components/bookTable';

const columns = [
  { label: "Title", accessor: "title" },
  { label: "Author", accessor: "author" },
];

function SearchBar({ searchTerm, searchTermChange }) {

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

function FilterableBookList() {

  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        searchTermChange={setSearchTerm} />
      <BookTable
        searchTerm={searchTerm}
        BOOKS={BOOKS}
        columns={columns} />
    </div>
  )
}

export default function App() {

  return <FilterableBookList />
}
