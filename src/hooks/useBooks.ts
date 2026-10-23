import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import booksData from '../data/all-books.json'
import type { Book, UserData } from '../types/book'

const LEGACY_KEY = 'jawnsite:added-books'
const CACHE_KEY = 'jawnsite:userdata'
const PASS_KEY = 'jawnsite:passcode'
const API = '/api/books'
const baseBooks = booksData as Book[]
const emptyData: UserData = { added: [], overrides: {}, deleted: [] }

export type SyncStatus = 'loading' | 'synced' | 'saving' | 'offline'

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

function parseData(raw: unknown): UserData | null {
  if (typeof raw !== 'object' || raw === null) return null
  const d = raw as Partial<UserData>
  if (!Array.isArray(d.added) || !Array.isArray(d.deleted)) return null
  return {
    added: d.added.filter(isBook),
    overrides: typeof d.overrides === 'object' && d.overrides ? d.overrides : {},
    deleted: d.deleted.filter((n): n is number => typeof n === 'number'),
  }
}

function loadCached(): UserData {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const parsed = parseData(JSON.parse(raw))
      if (parsed) return parsed
    }
    // Migrate books added before sync existed.
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy)
      if (Array.isArray(parsed)) return { ...emptyData, added: parsed.filter(isBook) }
    }
  } catch {
    // ignore corrupt storage
  }
  return emptyData
}

function cache(data: UserData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable or full — the server copy is still the source of truth.
  }
}

const isEmpty = (d: UserData) =>
  d.added.length === 0 && d.deleted.length === 0 && Object.keys(d.overrides).length === 0

const normalize = (s: string) => s.trim().toLowerCase()

export function useBooks() {
  const [data, setData] = useState<UserData>(loadCached)
  const [status, setStatus] = useState<SyncStatus>('loading')
  const dirty = useRef(false)
  const latest = useRef(data)
  const timer = useRef<number | undefined>(undefined)

  const push = useCallback(async () => {
    const send = (pass: string) =>
      fetch(API, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-passcode': pass },
        body: JSON.stringify(latest.current),
      })
    try {
      let pass = localStorage.getItem(PASS_KEY) ?? ''
      let res = pass ? await send(pass) : null
      if (!res || res.status === 401) {
        pass = window.prompt('Enter your passcode to save changes across devices:') ?? ''
        if (!pass) {
          setStatus('offline')
          return
        }
        res = await send(pass)
        if (res.status === 401) {
          localStorage.removeItem(PASS_KEY)
          setStatus('offline')
          return
        }
        localStorage.setItem(PASS_KEY, pass)
      }
      if (!res.ok) throw new Error(String(res.status))
      dirty.current = false
      setStatus('synced')
    } catch {
      setStatus('offline')
    }
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const remote = parseData(await res.json())
      if (dirty.current) return
      if (remote) {
        latest.current = remote
        setData(remote)
        cache(remote)
      } else if (!isEmpty(latest.current)) {
        // First run with sync: upload what this browser already had.
        await push()
        return
      }
      setStatus('synced')
    } catch {
      setStatus('offline')
    }
  }, [push])

  useEffect(() => {
    void load()
    const onFocus = () => {
      if (!dirty.current) void load()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  const update = useCallback(
    (fn: (d: UserData) => UserData) => {
      const next = fn(latest.current)
      latest.current = next
      dirty.current = true
      setData(next)
      cache(next)
      setStatus('saving')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => void push(), 600)
    },
    [push],
  )

  const books = useMemo(() => {
    const gone = new Set(data.deleted)
    const merged = baseBooks
      .filter((b) => !gone.has(b.id))
      .map((b) => ({ ...b, ...data.overrides[b.id] }))
    return [...merged, ...data.added.map((b) => ({ ...b, isCustom: true }))]
  }, [data])

  const isDuplicate = useCallback(
    (title: string, author: string, ignoreId?: number) =>
      books.some(
        (b) =>
          b.id !== ignoreId &&
          normalize(b.title) === normalize(title) &&
          normalize(b.author) === normalize(author),
      ),
    [books],
  )

  const addBook = useCallback(
    (fields: Omit<Book, 'id' | 'isCustom'>) => {
      update((d) => {
        const maxId = Math.max(0, ...baseBooks.map((b) => b.id), ...d.added.map((b) => b.id))
        const book: Book = {
          ...fields,
          title: fields.title.trim(),
          author: fields.author.trim(),
          id: maxId + 1,
          isCustom: true,
        }
        return { ...d, added: [...d.added, book] }
      })
    },
    [update],
  )

  const updateBook = useCallback(
    (id: number, patch: Partial<Omit<Book, 'id'>>) => {
      update((d) => {
        if (d.added.some((b) => b.id === id)) {
          return { ...d, added: d.added.map((b) => (b.id === id ? { ...b, ...patch } : b)) }
        }
        return { ...d, overrides: { ...d.overrides, [id]: { ...d.overrides[id], ...patch } } }
      })
    },
    [update],
  )

  const removeBook = useCallback(
    (id: number) => {
      update((d) =>
        d.added.some((b) => b.id === id)
          ? { ...d, added: d.added.filter((b) => b.id !== id) }
          : { ...d, deleted: [...d.deleted, id] },
      )
    },
    [update],
  )

  return { books, addBook, updateBook, removeBook, isDuplicate, status }
}
