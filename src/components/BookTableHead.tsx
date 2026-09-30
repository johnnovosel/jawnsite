import styles from './book.module.css'
import type { SortField, SortOrder } from '../types/book'

interface BookTableHeadProps {
  columns: { label: string; accessor: SortField }[]
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

export default function BookTableHead({
  columns,
  sortField,
  sortOrder,
  onSort,
}: BookTableHeadProps) {
  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor }) => {
          const isActive = sortField === accessor
          const cl = !isActive
            ? 'thdefault'
            : sortOrder === 'asc'
              ? 'thup'
              : 'thdown'
          const ariaSort = isActive
            ? sortOrder === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'

          return (
            <th key={accessor} aria-sort={ariaSort} className={styles[cl]}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => onSort(accessor)}
              >
                {label}
              </button>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
