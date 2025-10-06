'use client'

import React from 'react';
import BOOKS from '../_data/all-books.json'
import BookTable from './bookTable';
import SearchBar from './searchBar';
import InputBook from './inputBook';

// const BOOKS = []

const columns = [
    { label: "Title", accessor: "title" },
    { label: "Author", accessor: "author" },
];

export default function FilterableBookList() {

    const [searchTerm, setSearchTerm] = React.useState('')

    // const [data, setData] = React.useState(null);

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/book');
    //             const result = await response.json();
    //             setData(result);
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //         }
    //     };
    //     fetchData();
    // }, []); // Empty dependency array means this runs once on mount

    // console.log("Data:", data);

    return (
        <div>
            <InputBook />
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