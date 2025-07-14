import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private dataFilePath = path.join(__dirname, '..', 'data.json');
  // Чтение данных из файла
  private loadFromFile(): any[] {
    try {
      if (!fs.existsSync(this.dataFilePath)) return [];
      const content = fs.readFileSync(this.dataFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      return [];
    }
  }
  // Запись данных в файл
  private saveToFile(data: any[]) {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Ошибка при записи файла:', error);
    }
  }
  getData() {
    const data = this.loadFromFile();
    console.log('Данные считаны:', data.length);
    return data;
  }
  addData(newItems: any[]) {
    const data = this.loadFromFile();

    newItems.forEach(item => {
      data.push(item);
    });

    this.saveToFile(data);
    return { message: 'Добавлены новые строки', added: newItems };
  }
  updateData(editedItems: { id: number, changes: any }[]) {
    const data = this.loadFromFile();

    editedItems.forEach(({ id, changes }) => {
      const item = data.find(el => el.id === id);
      if (item) {
        for (const key in changes) {
          if (key === 'meanings' && typeof changes.meanings === 'object') {
            item.meanings = { ...item.meanings, ...changes.meanings };
          } else {
            item[key] = changes[key];
          }
        } // обновляем только изменённые поля
      }
    });
    this.saveToFile(data);
    return { message: 'Обновлены строки', updated: editedItems };
  }

  deleteData(idsToDelete: number[]) {
    let data = this.loadFromFile();

    const beforeLength = data.length;
    data = data.filter(item => !idsToDelete.includes(item.id));
    const deletedCount = beforeLength - data.length;

    this.saveToFile(data);
    return { message: `Удалено строк: ${deletedCount}`, deleted: idsToDelete };
  }
}
