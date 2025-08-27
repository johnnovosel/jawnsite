export default function BookTableBody({ columns, tableData }) {
    return (
        <tbody>
            {tableData.map((data) => {
                return (
                    <tr key={data.id}>
                        {columns.map(({ accessor }) => {
                            return <td key={accessor}>{data[accessor]}</td>;
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}