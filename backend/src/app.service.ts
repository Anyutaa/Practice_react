import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private dataFilePath = path.join(__dirname, '..', 'data.json');
  private maxId = 0;

  // Чтение данных из файла
  private async loadFromFile(): Promise<any[]> {
    try {
      await fs.access(this.dataFilePath); // проверка существования
      const content = await fs.readFile(this.dataFilePath, 'utf-8');
      const data = JSON.parse(content);
      let maxId = 0;
      for (const item of data) {
        if (typeof item.id === 'number' && item.id > maxId) {
          maxId = item.id;
        }
      }
      this.maxId = maxId;
      return data;
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      return [];
    }
  }

  // Запись данных в файл
  private async saveToFile(data: any[]): Promise<void> {
    try {
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Ошибка при записи файла:', error);
    }
  }

  async getData() {
    const data = await this.loadFromFile();
    console.log('Данные считаны:', data.length);
    return data;
  }

  // Добавление новых строк
  async addData(newItems: any[]) {
    const data = await this.loadFromFile();
    const idMap = {};

    const newItemsWithId = newItems.map(item => {
      this.maxId += 1;
      idMap[item.tempId] = this.maxId;

      return {
        id: this.maxId, // ставим в начало
        ...Object.fromEntries(
          Object.entries(item).filter(([key]) => key !== 'id')
        ),
      };
    });
    const updatedData = [...data, ...newItemsWithId];
    await this.saveToFile(updatedData); 
    return { message: 'Добавлены новые строки', idMap,};
  }

  // Редактирование строк
  async updateData(editedItems: { id: number; changes: any }[]) {
    const data = await this.loadFromFile();

    for (const { id, changes } of editedItems) {
      const item = data.find((el) => el.id === id || el.tempId === id);
      if (item) {
        for (const key in changes) {
          if (key === 'meanings' && typeof changes.meanings === 'object') {
            item.meanings = { ...item.meanings, ...changes.meanings };
          } else {
            item[key] = changes[key];
          }
        }
      }
    }
    await this.saveToFile(data);
    return { message: 'Обновлены строки', updated: editedItems };
  }
  
  // Удаление строк
  async deleteData(idsToDelete: number[]) {
    let data = await this.loadFromFile();

    const beforeLength = data.length;
    data = data.filter(
        (item) =>
          !(idsToDelete.includes(item.id) || idsToDelete.includes(item.tempId))
    );
    const deletedCount = beforeLength - data.length;

    await this.saveToFile(data);
    return { message: `Удалено строк: ${deletedCount}`, deleted: idsToDelete };
  }
}
