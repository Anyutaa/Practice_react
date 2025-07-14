export function AddClick(data, setData, addedRows, setAddedRows) {
  const maxId = Math.max(...data.map(row => row.id || 0), 0);
  const years = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [String(2026 + i), ''])
  );
  const newRow = {
    id: maxId + 1,
    name: '',
    unit_name: '',
    meanings: years
  };
  const newData = [...data, newRow];
  setData(newData);
  //записываем новую строчку в массив
  setAddedRows([...addedRows, newRow]);
}
export function DeleteClick(data, setData, selectedRowIndex, setSelectedRowIndex, deletedIds, setDeletedIds) {
  if (selectedRowIndex !== null) {
    const newData = [...data]; 
    const deletedItem = newData[selectedRowIndex];
    if (deletedItem && deletedItem.id !== undefined) {
      const newDeletedIds = [...deletedIds, deletedItem.id];
      // console.log(`Удалён элемент с id: ${deletedItem.id}`);
      // console.log('Текущий список удалённых ID:', newDeletedIds);
      //записываем id удаленной строки
      setDeletedIds(newDeletedIds);
    }   

    newData.splice(selectedRowIndex, 1);         
    setData(newData);                     
    setSelectedRowIndex(null);                   
  }
}