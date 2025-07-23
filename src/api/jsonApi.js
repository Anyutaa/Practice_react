import axios from 'axios';
const API_URL = 'http://localhost:3001/data';

// 1. GET - получить список или объект
export async function fetchData() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return [];
  }
}
//
export async function saveData(
  addedRows,
  editedRows,
  deletedIds,
  setAddedRows,
  setEditedRows,
  setDeletedIds,
  columns,
  setData
) {
  await saveAddedRows(addedRows, setData);
  await saveEditedRows(editedRows, columns);
  await deleteRows(deletedIds);
  setAddedRows([]);
  setEditedRows([]);
  setDeletedIds([]);
}
//saveAddedRows - собираем данные для создания новых строк
export async function saveAddedRows(addedRows, setData) {
  try {
    const response = await axios.post(`${API_URL}/add`, addedRows); // массив новых строк
    const idMap = response.data.idMap;

    // Обновляем реальные id в таблице, заменяя временные на реальные
    setData((prevData) =>
      prevData.map((row) =>
        row.tempId && idMap[row.tempId] ? { ...row, id: idMap[row.tempId] } : row
      )
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
  }
}
//saveEditedRows - собираем данные для редактирование даннных
export async function saveEditedRows(editedRows, columns) {
  try {
    const payload = editedRows.map((row) => {
      const changes = {};
      const rawChanges = row.changes;

      for (const key in rawChanges) {
        if (key === 'meanings') {
          const parsedMeanings = {};
          for (const yearKey in rawChanges.meanings) {
            const rawValue = rawChanges.meanings[yearKey];
            const parsed = parseFloat(
              typeof rawValue === 'string' ? rawValue.replace(',', '.') : rawValue
            );
            parsedMeanings[yearKey] = isNaN(parsed) ? rawValue : parsed;
          }
          changes.meanings = parsedMeanings;
        } else {
          changes[key] = rawChanges[key];
        }
      }

      return {
        id: row.id,
        changes,
      };
    });

    const response = await axios.patch(`${API_URL}/update`, payload);
    console.log('Payload for PATCH:', payload);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
}
// deleteRows - данные для удаления строк
export async function deleteRows(deletedIds) {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      data: deletedIds,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении данных:', error);
  }
}
