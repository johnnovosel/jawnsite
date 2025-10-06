import styles from './book.module.css';

export default function BookTableBody({ columns, tableData }) {
    return (
        <tbody>
            {tableData.map((data) => {

                const c1 = data.isLoaned ? "loanedRow" : "ownedRow"
                return (
                    <tr className={styles[c1]} key={data.id}>
                        {columns.map(({ accessor }) => {
                            return <td key={accessor}>{data[accessor]}</td>;
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}