import styles from './book.module.css'
import type { Book, SortField } from '../types/book'

interface BookTableBodyProps {
  columns: { label: string; accessor: SortField }[]
  tableData: Book[]
  onRemove?: (id: number) => void
}

export default function BookTableBody({ columns, tableData, onRemove }: BookTableBodyProps) {
  return (
    <tbody>
      {tableData.map((data) => {
        const rowClass = data.isLoaned ? styles.loanedRow : styles.ownedRow
        return (
          <tr className={rowClass} key={data.id}>
            {columns.map(({ accessor }) => (
              <td key={accessor}>{data[accessor]}</td>
            ))}
            <td className={styles.statusCol}>
              <span className={data.isLoaned ? styles.badgeLoaned : styles.badgeOwned}>
                {data.isLoaned ? 'Loaned' : 'Owned'}
              </span>
              {data.isCustom && onRemove && (
                <button
                  type="button"
                  className={styles.removeButton}
                  aria-label={`Remove ${data.title}`}
                  title="Remove added book"
                  onClick={() => onRemove(data.id)}
                >
                  ×
                </button>
              )}
            </td>
          </tr>
        )
      })}
      {tableData.length === 0 && (
        <tr>
          <td colSpan={columns.length + 1} className={styles.empty}>
            No books match your search.
          </td>
        </tr>
      )}
    </tbody>
  )
}
