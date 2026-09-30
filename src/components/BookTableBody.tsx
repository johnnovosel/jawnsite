import styles from './book.module.css'
import type { Book, SortField } from '../types/book'

interface BookTableBodyProps {
  columns: { label: string; accessor: SortField }[]
  tableData: Book[]
}

export default function BookTableBody({ columns, tableData }: BookTableBodyProps) {
  return (
    <tbody>
      {tableData.map((data) => {
        const rowClass = data.isLoaned ? 'loanedRow' : 'ownedRow'
        return (
          <tr className={styles[rowClass]} key={data.id}>
            {columns.map(({ accessor }) => (
              <td key={accessor}>{data[accessor]}</td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}
