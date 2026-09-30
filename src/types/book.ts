export interface Book {
  id: number
  title: string
  author: string
  isLoaned: boolean
}

export type SortField = 'title' | 'author'
export type SortOrder = 'asc' | 'desc'
