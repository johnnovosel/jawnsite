'use client'

import React from 'react';
import styles from './book.module.css';
import { addBook } from './actions';

export default function InputBook({ onBookAdded }) {
    const [showAddBookForm, setShowAddBookForm] = React.useState(false)

    async function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        try {
            // Get form data
            const form = e.target;
            const formData = new FormData(form);
            const title = formData.get('bookTitle');
            const author = formData.get('bookAuthor');

            // Validate inputs
            if (!title.trim() || !author.trim()) {
                return;
            }

            // Call server action to save the book
            const result = await addBook(title, author);

            if (result.success) {
                // Reset form and close dialog
                form.reset();
                setShowAddBookForm(false);
                // Call the callback to refresh the book list
                if (onBookAdded) {
                    onBookAdded();
                }
            } else {
            }
        } catch (err) {
        } finally {
        }
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
