import { useEffect, useRef, useState } from 'react'
import Rating from './Rating'
import styles from './book.module.css'
import type { Book } from '../types/book'

export type BookFields = Omit<Book, 'id' | 'isCustom'>

interface BookFormProps {
  open: boolean
  // When set, the form edits this book; otherwise it adds a new one.
  book?: Book
  onClose: () => void
  onSubmit: (fields: BookFields) => void
  isDuplicate: (title: string, author: string, ignoreId?: number) => boolean
}

// Downscale an uploaded photo so it stays small enough to sync.
function resizeImage(file: File, maxSide = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}

export default function BookForm({ open, book, onClose, onSubmit, isDuplicate }: BookFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [isLoaned, setIsLoaned] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const [rating, setRating] = useState(0)
  const [coverUrl, setCoverUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setTitle(book?.title ?? '')
      setAuthor(book?.author ?? '')
      setDescription(book?.description ?? '')
      setIsLoaned(book?.isLoaned ?? false)
      setIsRead(book?.isRead ?? false)
      setRating(book?.rating ?? 0)
      setCoverUrl(book?.coverUrl ?? '')
      setError('')
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open, book])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) {
      setError('Title and author are required.')
      return
    }
    if (isDuplicate(title, author, book?.id)) {
      setError('That book is already in the list.')
      return
    }
    onSubmit({
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || undefined,
      isLoaned,
      isRead,
      rating: rating || undefined,
      coverUrl: coverUrl || undefined,
    })
    onClose()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setCoverUrl(await resizeImage(file))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that image.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{book ? 'Edit book' : 'Add a book'}</h2>

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

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="book-desc">Description</label>
          <textarea
            id="book-desc"
            className={styles.formInput}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Leave blank to look one up automatically"
          />
        </div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Cover picture</span>
          <div className={styles.coverRow}>
            {coverUrl ? (
              <img className={styles.coverThumb} src={coverUrl} alt="" />
            ) : (
              <div className={styles.coverThumbEmpty}>No cover</div>
            )}
            <div className={styles.coverActions}>
              <label className={styles.secondaryButton}>
                {coverUrl ? 'Change' : 'Upload'}
                <input type="file" accept="image/*" hidden onChange={handleFile} />
              </label>
              {coverUrl && (
                <button type="button" className={styles.secondaryButton} onClick={() => setCoverUrl('')}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Your rating</span>
          <Rating value={rating} onChange={setRating} size="lg" />
        </div>

        <label className={styles.checkRow}>
          <input type="checkbox" checked={isRead} onChange={(e) => setIsRead(e.target.checked)} />
          I've read this
        </label>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={isLoaned} onChange={(e) => setIsLoaned(e.target.checked)} />
          Currently loaned out
        </label>

        {error && <p className={styles.formError} role="alert">{error}</p>}

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>
            {book ? 'Save changes' : 'Add book'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
