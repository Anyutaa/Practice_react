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
  private tempIdMap: Record<string, number> = {};
  // Добавление новых строк
  async addData(newItems: any[]) {
    const data = await this.loadFromFile();
    const idMap: Record<string, number> = {};

    const newItemsWithId = newItems.map((item) => {
      this.maxId += 1;
      if (item.tempId) {
        idMap[item.tempId] = this.maxId;
        this.tempIdMap[item.tempId] = this.maxId;
      }
      return {
        id: this.maxId,
        ...Object.fromEntries(
          Object.entries(item).filter(
            ([key]) => key !== 'id' && key !== 'tempId',
          ),
        ),
      };
    });
    const updatedData = [...data, ...newItemsWithId];
    await this.saveToFile(updatedData);
    return { message: 'Добавлены новые строки', idMap };
  }

  // Редактирование строк
  async updateData(editedItems: { id: number | string; changes: any }[]) {
    const data = await this.loadFromFile();

    for (const { id, changes } of editedItems) {
      const realId =
        typeof id === 'string' && this.tempIdMap[id] ? this.tempIdMap[id] : id;
      const item = data.find((el) => el.id === realId);
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
  async deleteData(idsToDelete: (number | string)[]) {
    const data = await this.loadFromFile();

    const ids = idsToDelete.map((id) =>
      typeof id === 'string' && this.tempIdMap[id] ? this.tempIdMap[id] : id,
    );

    const filtered = data.filter((item) => !ids.includes(item.id));
    const deletedCount = data.length - filtered.length;

    await this.saveToFile(filtered);
    this.tempIdMap = {};
    return { message: `Удалено строк: ${deletedCount}`, deleted: ids };
  }
}
