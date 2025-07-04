export function AddClick(data, setData) {
  const newRow = {
    indicator: '',
    init: '',
    ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(2026 + i), '']))
  };
  const newData = [...data, newRow];
  setData(newData);
}
export function DeleteClick(data, setData, selectedRowIndex, setSelectedRowIndex) {
  if (selectedRowIndex !== null) {
    const newData = [...data];               
    newData.splice(selectedRowIndex, 1);         
    setData(newData);                           
    setSelectedRowIndex(null);                   
  }
}