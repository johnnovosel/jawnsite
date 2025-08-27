import React from 'react';
import styles from './book.module.css';

export default function BookTableHead({ columns, handleSorting }) {
    const [sortField, setSortField] = React.useState("");
    const [order, setOrder] = React.useState("asc");
    const handleSortingChange = (accessor) => {
        const sortOrder =
            accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };

    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor }) => {
                    const cl = sortField != accessor ? "thdefault" :
                        order === "asc" ? "thup" :
                            "thdown"
                    return <th key={accessor} onClick={() => handleSortingChange(accessor)} className={styles[cl]}
                    >{label}</th>;
                })}
            </tr>
        </thead>
    );
}