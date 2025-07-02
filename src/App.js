import './App.css';
import styles from './Header.module.css';

import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { makeData } from './makeData'
import style_table from './Table.module.css'



function Table({ columns, data }) {
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
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}


// function Table({ columns, data }) {
//   // Use the state and functions returned from useTable to build your UI
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = useTable({
//     columns,
//     data,
//   })

//   // Render the UI for your table
//   return (
//     <table {...getTableProps()} className={style_table.table}>
//       <thead>
//         {headerGroups.map(headerGroup => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map(column => (
//               <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row, i) => {
//           prepareRow(row)
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map(cell => {
//                 return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//               })}
//             </tr>
//           )
//         })}
//       </tbody>
//     </table>
//   )
// }

function App() {
  const baseColumns = [
      {
        Header: 'Показатель',
        accessor: 'indicator',
      },
      {
        Header: 'ед.изм.',
        accessor: 'init',
      },
    ]

    const yearColumns = Array.from({ length: 12 }, (_, i) => {
      const year = 2026 + i
      return {
        Header: String(year),
        accessor: String(year),
      }
    })

    const columns = React.useMemo(
      () => [...baseColumns, ...yearColumns],
      []
    )

    const data = React.useMemo(() => makeData(2), [])

    return (
      <div>
      <h1 className={styles.movableHeader}>Месторождение</h1>
      <button 
        className="icon-button"
        aria-label="Добавить"
        //onClick={handleAddClick}
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
        //onClick={handleDeleteClick}
        style={{ all: 'unset' }}
      >
        <img 
          src="Icon/Icon_deletion.png" 
          alt=""
          className="clickable-icon_deletion" 
        />
      </button>
      <div className={style_table.wrapper}>
      <Table columns={columns} data={data} />
      </div>
      </div>
   )
  
}

export default App;


