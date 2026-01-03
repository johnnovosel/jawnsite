import React from 'react';
import BookTableHead from './bookTableHead';
import BookTableBody from './bookTableBody';

export default function BookTable({ columns, searchTerm, BOOKS }) {

  BOOKS.sort((a, b) => {
    const authorA = a.author.split(' ').pop();
    const authorB = b.author.split(' ').pop();
    return authorA.localeCompare(authorB, "en", { numeric: true });
  });

  const [bookList, setBookList] = React.useState(BOOKS)

  // Update bookList when BOOKS prop changes
  React.useEffect(() => {
    setBookList(BOOKS);
  }, [BOOKS]);

  const handleSorting = (sortField, sortOrder) => {
    const sorted = [...bookList].sort((a, b) => {

      if (sortField === "author") {
        a = a[sortField].split(' ').pop()
        b = b[sortField].split(' ').pop()
      } else {
        a = a[sortField]
        b = b[sortField]
      }

      return (
        a.localeCompare(b, "en", {
          numeric: true,
        }) * (sortOrder === "asc" ? 1 : -1)
      );
    });
    setBookList(sorted);
  };

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