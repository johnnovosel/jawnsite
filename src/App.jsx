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

function BookTableHead({ columns, handleSorting }) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
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
              ? "up"
              : sortField === accessor && order === "desc"
                ? "down"
                : "default";
          return <th key={accessor} onClick={() => handleSortingChange(accessor)} className={cl}
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

  const [bookList, setBookList] = useState(BOOKS)

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
    <table>
      <BookTableHead columns={columns} handleSorting={handleSorting} />
      <BookTableBody columns={columns} tableData={rows} />
    </table>
  );
}

function FilterableBookList() {

  const [searchTerm, setSearchTerm] = useState('')

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
