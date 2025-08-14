'use client'

import React from 'react';
import styles from './book.module.css';
import BOOKS from './books.json'

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

function BookTableHead({ columns, handleSorting }) {
  const [sortField, setSortField] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor }) => {
          const cl = sortField === accessor && order === "asc"
              ? "thup"
              : sortField === accessor && order === "desc"
                ? "thdown"
                : "thdefault";
          return <th key={accessor} onClick={() => handleSortingChange(accessor)} className={styles[cl]}
          >{label}</th>;
        })}
      </tr>
    </thead>
  );
}

function BookTableBody({ columns, tableData }) {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id}>
            {columns.map(({ accessor }) => {
              return <td key={accessor}>{data[accessor]}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

function BookTable({ searchTerm }) {

  const [bookList, setBookList] = React.useState(BOOKS)

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...bookList].sort((a, b) => {
        return (
          a[sortField].localeCompare(b[sortField], "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setBookList(sorted);
    }
  };

  const columns = [
    { label: "Title", accessor: "title" },
    { label: "Author", accessor: "author" },
  ];

  const rows = []

  bookList.forEach((book) => {
    if (book.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      book.author.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
      rows.push(book);
    }
  });

  return (
    <table >
      <BookTableHead columns={columns} handleSorting={handleSorting} />
      <BookTableBody columns={columns} tableData={rows} />
    </table>
  );
}

function FilterableBookList() {

  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        searchTermChange={setSearchTerm} />
      <BookTable
        searchTerm={searchTerm} />
    </div>
  )
}

export default function App() {

  return <FilterableBookList />
}
