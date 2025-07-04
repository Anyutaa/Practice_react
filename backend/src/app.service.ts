import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private dataFilePath = path.join(__dirname, '..', 'data.json');

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
}
