import Rating from './Rating'
import styles from './book.module.css'
import type { Book, SortField } from '../types/book'

interface BookTableBodyProps {
  columns: { label: string; accessor: SortField }[]
  tableData: Book[]
  selectedId?: number
  onSelect: (id: number) => void
}

export default function BookTableBody({ columns, tableData, selectedId, onSelect }: BookTableBodyProps) {
  return (
    <tbody>
      {tableData.map((data) => {
        const rowClass = [
          data.isLoaned ? styles.loanedRow : styles.ownedRow,
          styles.clickRow,
          data.id === selectedId ? styles.selectedRow : '',
        ].join(' ')
        return (
          <tr
            className={rowClass}
            key={data.id}
            tabIndex={0}
            aria-selected={data.id === selectedId}
            onClick={() => onSelect(data.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(data.id)
              }
            }}
          >
            {columns.map(({ accessor }) => (
              <td key={accessor} className={accessor === 'title' ? styles.titleCell : undefined}>
                {data[accessor]}
              </td>
            ))}
            <td className={`${styles.statusCol} ${styles.ratingCol}`}>
              {data.rating ? <Rating value={data.rating} /> : <span className={styles.dash}>—</span>}
            </td>
            <td className={styles.statusCol}>
              {data.isRead && <span className={styles.badgeRead}>Read</span>}
              {data.isLoaned && <span className={styles.badgeLoaned}>Loaned</span>}
            </td>
          </tr>
        )
      })}
      {tableData.length === 0 && (
        <tr>
          <td colSpan={columns.length + 2} className={styles.empty}>
            No books match your search.
          </td>
        </tr>
      )}
    </tbody>
  )
}
