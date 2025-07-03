import { 
  Controller, Get, Post, 
  Body, Patch, Param, Delete, Query 
} from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('data')
export class AppController {
  private dataFilePath = path.join(__dirname, '..', 'data.json');

   @Get()
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
