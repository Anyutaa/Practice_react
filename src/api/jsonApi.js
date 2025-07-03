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

// 2. POST - добавить новые данные
export async function addData(newItem) {
  try {
    const response = await axios.post(API_URL, newItem);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
  }
}

// 3. PUT - обновить данные по id (полное обновление)
export async function updateData(id, updatedItem) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedItem);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
}

// 4. PATCH - обновить частично (например, одно поле)
export async function patchData(id, partialItem) {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, partialItem);
    return response.data;
  } catch (error) {
    console.error('Ошибка при частичном обновлении:', error);
  }
}

// 5. DELETE - удалить данные по id
export async function deleteData(id) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении:', error);
  }
}
