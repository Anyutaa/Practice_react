import './App.css';
import styles from './Header.module.css';

import React, { useState, useEffect} from 'react';
import { useTable } from 'react-table'
import style_table from './Table.module.css'
import * as api from './api/jsonApi';
import { AddClick, DeleteClick } from './button_functions';


function Table({ columns, data, selectedRowIndex, setSelectedRowIndex  }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
  // Render the UI for your table
  return (
    <div className={style_table.tableWrap}>
      <table {...getTableProps()} className={style_table.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            const isSelected = i === selectedRowIndex;
            return (
              <tr
                {...row.getRowProps()}
                style={{
                  backgroundColor: isSelected ? '#d0eaff' : 'white',
                  cursor: 'pointer',
                }}
              >
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    onClick={() => {
                      if (cell.column.id === 'name' && selectedRowIndex !== i) {
                        setSelectedRowIndex(row.index);
                      } else {
                        setSelectedRowIndex(null);
                      }
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const baseColumns = [
      {
        Header: 'Показатель',
        accessor: 'name',
      },
      {
        Header: 'ед.изм.',
        accessor: 'unit_name',
      },
    ]

const yearColumns = Array.from({ length: 12 }, (_, i) => {
  const year = 2026 + i
  return {
    Header: String(year),
    accessor: String(year),
  }
})

function App() {
    const [data, setData] = useState([]); 
    const columns = React.useMemo(
      () => [...baseColumns, ...yearColumns],
      []
    );

    useEffect(() => {
    async function loadData() {
      const fetchedData = await api.fetchData();
      console.log('Полученные данные с API:', fetchedData);
      if (Array.isArray(fetchedData)) {
        const formattedData = fetchedData.map(item => ({
          name: item.name,
          unit_name: item.unit_name,
          ...item.meanings 
        }));
        setData(formattedData);
      } else {
        console.error('Полученные данные не являются массивом', fetchedData);
      }
    }
    loadData();
    }, []);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    return (
      <div>
      <h1 className={styles.movableHeader}>Месторождение</h1>
      <button 
        className="icon-button"
        aria-label="Добавить"
        onClick={() => AddClick(data, setData)}
        style={{ all: 'unset' }} 
      >
        <img 
          src="Icon/Icon_adding.png" 
          alt=""
          className="clickable-icon_adding"
        />
      </button>

      <button 
        className="icon-button"
        aria-label="Удалить"
        onClick={() => DeleteClick(data, setData, selectedRowIndex, setSelectedRowIndex)}
        
        style={{ all: 'unset' }}
      >
        <img 
          src="Icon/Icon_deletion.png" 
          alt=""
          className="clickable-icon_deletion" 
        />
      </button>
      <div className={style_table.wrapper}>
      <Table columns={columns} data={data}
      selectedRowIndex={selectedRowIndex}
      setSelectedRowIndex={setSelectedRowIndex}/>
      </div>
      </div>
   )
}

export default App;


