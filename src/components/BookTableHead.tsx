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
          const arrow = !isActive ? '↕' : sortOrder === 'asc' ? '↑' : '↓'
          const ariaSort = isActive
            ? sortOrder === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'

          return (
            <th
              key={accessor}
              aria-sort={ariaSort}
              className={isActive ? styles.thActive : undefined}
            >
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => onSort(accessor)}
              >
                {label}
                <span className={styles.sortArrow} aria-hidden="true">{arrow}</span>
              </button>
            </th>
          )
        })}
        <th className={styles.statusCol}>Status</th>
      </tr>
    </thead>
  )
}
