import { useEffect, useMemo, useState } from 'react'
import Rating from './Rating'
import styles from './bookDetail.module.css'
import type { Book } from '../types/book'

interface BookDetailProps {
  book: Book
  books: Book[]
  onClose: () => void
  onSelect: (id: number) => void
  onEdit: () => void
  onDelete: () => void
  onUpdate: (id: number, patch: Partial<Omit<Book, 'id'>>) => void
}

// Books we've already looked up this session (found or not), so we only ask once.
const lookedUp = new Set<number>()

const surname = (author: string) => author.trim().split(/\s+/).pop() ?? author
const palette = ['#7d8f6c', '#b79a6b', '#9c6f5a', '#6f8795', '#a58a6e', '#8a7a9b']

async function lookupOpenLibrary(book: Book): Promise<Partial<Book>> {
  const q = new URLSearchParams({
    title: book.title,
    author: book.author,
    limit: '1',
    fields: 'key,cover_i',
  })
  const res = await fetch(`https://openlibrary.org/search.json?${q}`)
  if (!res.ok) return {}
  const hit = (await res.json()).docs?.[0] as { key?: string; cover_i?: number } | undefined
  if (!hit) return {}

  const found: Partial<Book> = {}
  if (hit.cover_i) found.coverUrl = `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`
  if (hit.key) {
    const work = await fetch(`https://openlibrary.org${hit.key}.json`)
    if (work.ok) {
      const d = (await work.json()).description as string | { value?: string } | undefined
      const text = typeof d === 'string' ? d : d?.value
      // Open Library descriptions often trail off into "----- Contains ..." notes.
      if (text) found.description = text.split(/\r?\n-{3,}/)[0].trim()
    }
  }
  return found
}

export default function BookDetail({
  book,
  books,
  onClose,
  onSelect,
  onEdit,
  onDelete,
  onUpdate,
}: BookDetailProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Fill in a missing cover/description from Open Library, once per book.
  const { id, title, author, coverUrl, description } = book
  useEffect(() => {
    if ((coverUrl && description) || lookedUp.has(id)) return
    lookedUp.add(id)
    setLoading(true)
    lookupOpenLibrary({ id, title, author } as Book)
      .then((found) => {
        const patch: Partial<Book> = {}
        if (!coverUrl && found.coverUrl) patch.coverUrl = found.coverUrl
        if (!description && found.description) patch.description = found.description
        if (Object.keys(patch).length) onUpdate(id, patch)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  },[id, title, author, coverUrl, description, onUpdate])

  const sameAuthor = useMemo(
    () =>
      books
        .filter((b) => b.id !== book.id && b.author.trim().toLowerCase() === book.author.trim().toLowerCase())
        .sort((a, b) => a.title.localeCompare(b.title)),
    [books, book.id, book.author],
  )

  const spine = palette[book.id % palette.length]

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <aside className={styles.panel} aria-label={`Details for ${book.title}`}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className={styles.scroll}>
          <div className={styles.hero}>
            <div className={styles.cover}>
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
              ) : (
                <div className={styles.placeholder} style={{ background: spine }}>
                  <span>{book.title}</span>
                  <small>{surname(book.author)}</small>
                </div>
              )}
            </div>

            <div className={styles.heading}>
              <h2 className={styles.title}>{book.title}</h2>
              <p className={styles.author}>by {book.author}</p>
              <div className={styles.ratingRow}>
                <Rating
                  value={book.rating}
                  size="lg"
                  onChange={(n) => onUpdate(book.id, { rating: n || undefined })}
                />
                <span className={styles.ratingText}>{book.rating ? `${book.rating} / 5` : 'Not rated'}</span>
              </div>
              <div className={styles.badges}>
                <button
                  type="button"
                  className={book.isRead ? styles.badgeRead : styles.badgeUnread}
                  onClick={() => onUpdate(book.id, { isRead: !book.isRead })}
                  title="Click to toggle"
                >
                  {book.isRead ? '✓ Read' : 'Unread'}
                </button>
                <button
                  type="button"
                  className={book.isLoaned ? styles.badgeLoaned : styles.badgeOwned}
                  onClick={() => onUpdate(book.id, { isLoaned: !book.isLoaned })}
                  title="Click to toggle"
                >
                  {book.isLoaned ? 'Loaned out' : 'On my shelf'}
                </button>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3>About this book</h3>
            {book.description ? (
              <p className={styles.description}>{book.description}</p>
            ) : (
              <p className={styles.muted}>
                {loading ? 'Looking for a description…' : 'No description yet. Use Edit to write one.'}
              </p>
            )}
          </section>

          {sameAuthor.length > 0 && (
            <section className={styles.section}>
              <h3>More by {book.author}</h3>
              <ul className={styles.more}>
                {sameAuthor.map((b) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => onSelect(b.id)}>
                      <span>{b.title}</span>
                      {b.rating ? <Rating value={b.rating} /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.edit} onClick={onEdit}>
              Edit
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={() => {
                if (window.confirm(`Remove "${book.title}" from your list?`)) onDelete()
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
