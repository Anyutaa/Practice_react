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
export async function saveData(newItem) {
  try {
    const response = await axios.post(API_URL, newItem);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
  }
}
