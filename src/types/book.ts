export interface Book {
  id: number
  title: string
  author: string
  isLoaned: boolean
  isCustom?: boolean
}

export type SortField = 'title' | 'author'
export type SortOrder = 'asc' | 'desc'
export type StatusFilter = 'all' | 'owned' | 'loaned'
