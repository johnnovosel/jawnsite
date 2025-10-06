'use client'

import React from 'react';
import BOOKS from '../_data/all-books.json'
import styles from './book.module.css';

export default function InputBook() {
    const [showAddBookForm, setShowAddBookForm] = React.useState(false)

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());

        let newID = findMaxID(BOOKS) + 1

        console.log(newID);
    }

    return (
        <div>
            <button
                className={styles.addBookButton}
                onClick={() => setShowAddBookForm(true)}
            >
                Add New Book
            </button>

            {showAddBookForm && (
                <div className={styles.formContainer}>
                    <h2 className={styles.formTitle}>Add New Book</h2>
                    <form method="post" onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Title:</label>
                            <input
                                type="text"
                                name="bookTitle"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Author:</label>
                            <input
                                type="text"
                                name="bookAuthor"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={() => setShowAddBookForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="reset"
                                className={styles.secondaryButton}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className={styles.primaryButton}
                            >
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function findMaxID(books) {
    let maxId = 0;
    books.forEach(book => {
        if (book.id > maxId) {
            maxId = book.id;
        }
    });
    return maxId;
}

function appendBook(newBook) { 

}