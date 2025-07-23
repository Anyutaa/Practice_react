import './App.css';
import styles from './Header.module.css';

import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import style_table from './Table.module.css';
import style_input from './Input.module.css';
import * as api from './api/jsonApi';
import { AddClick, DeleteClick } from './button_functions';
import { Button } from 'primereact/button';
import { drawChart } from './chart_function';

function Table({
  columns,
  data,
  setData,
  selectedRowIndex,
  setSelectedRowIndex,
  editedRows,
  setEditedRows,
  selectedId,
  yearColumns,
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  const [editingCell, setEditingCell] = useState({
    rowIndex: null,
    columnId: null,
  });

  const handleChange = (e, rowIndex, columnId) => {
    const newData = [...data];
    let inputValue = e.target.value;
    inputValue = inputValue.replace(',', '.');

    const updatedRow = { ...newData[rowIndex] };
    // Проверяем является ли колонка годом
    const column = columns.find((col) => col.id === columnId);
    const isYearColumn = column?.isYear === true;
    if (isYearColumn) {
      updatedRow.meanings = {
        ...updatedRow.meanings,
        [columnId]: inputValue,
      };
    } else {
      updatedRow[columnId] = inputValue;
    }

    newData[rowIndex] = updatedRow;
    setData(newData);

    let changes;
    if (isYearColumn) {
      changes = { meanings: { [columnId]: inputValue } };
    } else {
      changes = { [columnId]: inputValue };
    }

    const changeEntry = {
      id: updatedRow.id,
      changes,
    };

    // проверяем редактировалась ли строчка уже и если да, то дописываем новые изменения
    const isAlreadyEdited = editedRows.find((r) => r.id === updatedRow.id);
    if (isAlreadyEdited) {
      setEditedRows((prev) =>
        prev.map((r) => {
          if (r.id !== updatedRow.id) return r;
          const prevChanges = r.changes;

          if (isYearColumn) {
            return {
              ...r,
              changes: {
                ...prevChanges,
                meanings: {
                  ...(prevChanges.meanings || {}),
                  [columnId]: inputValue,
                },
              },
            };
          } else {
            return {
              ...r,
              changes: {
                ...prevChanges,
                [columnId]: inputValue,
              },
            };
          }
        })
      );
    } else {
      setEditedRows((prev) => [...prev, changeEntry]);
    }
  };

  const handleBlur = (rowIndex, rowId) => {
    setEditingCell({ rowIndex: null, columnId: null });

    if (rowId === selectedId) {
      drawChart(data, rowId, yearColumns);
    }
  };

  return (
    <div className={style_table.tableWrap}>
      <table
        {...getTableProps()}
        className={style_table.table}
        style={{ tableLayout: 'fixed', width: '100%' }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
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
                {row.cells.map((cell) => {
                  const isEditing =
                    editingCell.rowIndex === i && editingCell.columnId === cell.column.id;

                  return (
                    <td
                      {...cell.getCellProps()}
                      onClick={() => {
                        if (cell.column.id === 'name' && selectedRowIndex !== i) {
                          setSelectedRowIndex(row.index);
                        } else {
                          setSelectedRowIndex(null);
                        }
                        setEditingCell({
                          rowIndex: i,
                          columnId: cell.column.id,
                        });
                      }}
                    >
                      {isEditing
                        ? (() => {
                            let value = '';
                            if (cell.column.isYear) {
                              value = data[i]?.meanings?.[cell.column.id] ?? '';
                            } else {
                              value = data[i]?.[cell.column.id] ?? '';
                            }
                            const rowId = data[i]?.id;
                            return cell.column.selectOptions ? (
                              <select
                                className={style_input.editableInput}
                                value={value}
                                onChange={(e) => handleChange(e, i, cell.column.id)}
                                onBlur={() => handleBlur(i, rowId)}
                                maxLength={20}
                                autoFocus
                              >
                                <option value="">Выберите</option>
                                {cell.column.selectOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                className={style_input.editableInput}
                                value={value}
                                onChange={(e) => handleChange(e, i, cell.column.id)}
                                onBlur={() => handleBlur(i, rowId)}
                                maxLength={20}
                                autoFocus
                              />
                            );
                          })()
                        : cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const baseColumns = [
  {
    Header: 'Показатель',
    accessor: 'name',
    id: 'name',
  },
  {
    Header: 'ед.изм.',
    accessor: 'unit_name',
    selectOptions: ['млн м3', 'тыс.т', 'млн м3/год', 'процент'],
    id: 'unit_name',
  },
];

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [yearColumns, setYearColumns] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await api.fetchData();
      console.log('Полученные данные с API:', fetchedData);

      if (!Array.isArray(fetchedData)) {
        console.error('Полученные данные не являются массивом', fetchedData);
        return;
      }

      const formattedData = fetchedData.map((item) => ({
        id: item.id,
        name: item.name,
        unit_name: item.unit_name,
        meanings: item.meanings || {},
      }));

      // Получаем все уникальные года из meanings
      const allYears = new Set();
      formattedData.forEach((item) => {
        Object.keys(item.meanings).forEach((year) => allYears.add(year));
      });

      const yearColumns = Array.from(allYears)
        .sort()
        .map((year) => ({
          Header: year,
          accessor: (row) => row.meanings?.[year] ?? '',
          id: year,
          isYear: true,
        }));
      setYearColumns(yearColumns);
      setColumns([...baseColumns, ...yearColumns]);
      setData(formattedData);
    }

    loadData();
  }, []);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [addedRows, setAddedRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const handleClick = (id) => {
    setSelectedId(id);
    drawChart(data, id, yearColumns);
  };

  return (
    <div>
      <h1 className={styles.movableHeader}>Месторождение</h1>
      <button
        className="icon-button"
        aria-label="Добавить"
        onClick={() => AddClick(data, setData, addedRows, setAddedRows)}
        style={{ all: 'unset' }}
      >
        <img src="Icon/Icon_adding.png" alt="" className="clickable-icon_adding" />
      </button>

      <button
        className="icon-button"
        aria-label="Удалить"
        onClick={() =>
          DeleteClick(
            data,
            setData,
            selectedRowIndex,
            setSelectedRowIndex,
            deletedIds,
            setDeletedIds
          )
        }
        style={{ all: 'unset' }}
      >
        <img src="Icon/Icon_deletion.png" alt="" className="clickable-icon_deletion" />
      </button>
      <div className={style_table.wrapper}>
        <Table
          columns={columns}
          data={data}
          setData={setData}
          selectedRowIndex={selectedRowIndex}
          setSelectedRowIndex={setSelectedRowIndex}
          editedRows={editedRows}
          setEditedRows={setEditedRows}
          selectedId={selectedId}
          yearColumns={yearColumns}
        />
      </div>
      <Button
        label="Сохранить"
        className="save-button"
        onClick={() =>
          api.saveData(
            addedRows,
            editedRows,
            deletedIds,
            setAddedRows,
            setEditedRows,
            setDeletedIds,
            columns,
            setData
          )
        }
      />
      <Button
        label="Газ (вал.)"
        className={`chart-button ${selectedId === 1 ? 'active' : ''}`}
        onClick={() => handleClick(1)}
      />
      <Button
        label="Конденсат (нестаб.)"
        className={`chart-button ${selectedId === 3 ? 'active' : ''}`}
        onClick={() => handleClick(3)}
      />
      <Button
        label="Пик"
        className={`chart-button ${selectedId === 6 ? 'active' : ''}`}
        onClick={() => handleClick(6)}
      />
      <canvas
        id="myChart"
        width="1000"
        height="300"
        style={{
          display: 'block',
          margin: '40px auto',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}

export default App;
