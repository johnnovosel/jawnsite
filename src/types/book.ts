export interface Book {
  id: number
  title: string
  author: string
  isLoaned: boolean
  isCustom?: boolean
  isRead?: boolean
  rating?: number
  description?: string
  coverUrl?: string
}

// Everything the user changes on top of the bundled book list. Synced via the
// Netlify function so edits follow the user across devices.
export interface UserData {
  added: Book[]
  overrides: Record<string, Partial<Book>>
  deleted: number[]
}

export type SortField = 'title' | 'author'
export type SortOrder = 'asc' | 'desc'
export type StatusFilter = 'all' | 'owned' | 'loaned'
export type ReadFilter = 'any' | 'read' | 'unread'
