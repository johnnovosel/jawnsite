'use client'

import React from 'react';
import BookTable from './bookTable';
import SearchBar from './searchBar';
import InputBook from './inputBook';

const columns = [
    { label: "Title", accessor: "title" },
    { label: "Author", accessor: "author" },
];

export default function FilterableBookList() {

    const [searchTerm, setSearchTerm] = React.useState('')
    const [books, setBooks] = React.useState([]);

    const loadBooks = async () => {
        try {
            const response = await fetch('/api/books');
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            }
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    React.useEffect(() => {
        loadBooks();
    }, []);


    return (
        <div>
            <InputBook onBookAdded={loadBooks} />
            <SearchBar
                searchTerm={searchTerm}
                searchTermChange={setSearchTerm} />
            <BookTable
                searchTerm={searchTerm}
                BOOKS={books}
                columns={columns} />
        </div>
    )
}