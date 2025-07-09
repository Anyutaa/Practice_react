import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AppService {
  private dataFilePath = path.join(__dirname, '..', 'data1.json');

  getData() {
    try {
      const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
      console.log('Данные считались');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Ошибка при чтении данных:', error);
      return { success: false, message: 'Ошибка при чтении данных' };
    }
  }
  
  async postData(newItem: any) {
    try {
      console.log('Получены данные:', newItem);
      const formatted = newItem.map((item, index) => {
        const { name, unit_name, ...years } = item;

        return {
          id: index + 1,              
          name,
          unit_name,
          meanings: Object.fromEntries(
            Object.entries(years)
              .sort(([a], [b]) => a.localeCompare(b)) 
          )
        };
      });
    const jsonData = JSON.stringify(formatted, null, 2);
    await writeFile('data1.json', jsonData, 'utf8');
    return { success: true, saved: jsonData };
    } catch (error) {
      console.error('Ошибка при записи данных:', error);
      return { success: false, message: 'Ошибка при чтении данных' };
    }
  }
}
