import { useEffect, useRef, useState } from 'react'
import styles from './book.module.css'

interface AddBookFormProps {
  open: boolean
  onClose: () => void
  onAdd: (title: string, author: string, isLoaned: boolean) => void
  isDuplicate: (title: string, author: string) => boolean
}

export default function AddBookForm({ open, onClose, onAdd, isDuplicate }: AddBookFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isLoaned, setIsLoaned] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const reset = () => {
    setTitle('')
    setAuthor('')
    setIsLoaned(false)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) {
      setError('Title and author are required.')
      return
    }
    if (isDuplicate(title, author)) {
      setError('That book is already in the list.')
      return
    }
    onAdd(title, author, isLoaned)
    reset()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={() => {
        reset()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Add a book</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="book-title">Title</label>
          <input
            id="book-title"
            className={styles.formInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="book-author">Author</label>
          <input
            id="book-author"
            className={styles.formInput}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={isLoaned}
            onChange={(e) => setIsLoaned(e.target.checked)}
          />
          Currently loaned out
        </label>

        {error && <p className={styles.formError} role="alert">{error}</p>}

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>Add book</button>
        </div>
      </form>
    </dialog>
  )
}
