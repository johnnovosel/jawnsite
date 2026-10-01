import { useCallback, useMemo, useState } from 'react'
import booksData from '../data/all-books.json'
import type { Book } from '../types/book'

const STORAGE_KEY = 'jawnsite:added-books'
const baseBooks = booksData as Book[]

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false
  const b = value as Record<string, unknown>
  return (
    typeof b.id === 'number' &&
    typeof b.title === 'string' &&
    typeof b.author === 'string' &&
    typeof b.isLoaned === 'boolean'
  )
}

function loadAdded(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter(isBook).map((b) => ({ ...b, isCustom: true }))
      : []
  } catch {
    return []
  }
}

function saveAdded(books: Book[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch {
    // Storage unavailable (private mode / quota) — keep in-memory only.
  }
}

const normalize = (s: string) => s.trim().toLowerCase()

export function useBooks() {
  const [added, setAdded] = useState<Book[]>(loadAdded)

  const books = useMemo(() => [...baseBooks, ...added], [added])

  const isDuplicate = useCallback(
    (title: string, author: string) =>
      books.some(
        (b) => normalize(b.title) === normalize(title) && normalize(b.author) === normalize(author),
      ),
    [books],
  )

  const addBook = useCallback(
    (title: string, author: string, isLoaned: boolean) => {
      setAdded((prev) => {
        const maxId = Math.max(0, ...baseBooks.map((b) => b.id), ...prev.map((b) => b.id))
        const next = [
          ...prev,
          { id: maxId + 1, title: title.trim(), author: author.trim(), isLoaned, isCustom: true },
        ]
        saveAdded(next)
        return next
      })
    },
    [],
  )

  const removeBook = useCallback((id: number) => {
    setAdded((prev) => {
      const next = prev.filter((b) => b.id !== id)
      saveAdded(next)
      return next
    })
  }, [])

  return { books, addBook, removeBook, isDuplicate }
}
