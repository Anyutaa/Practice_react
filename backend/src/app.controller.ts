import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('data')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData() {
    return await this.appService.getData();
  }

  @Post('add')
  async addData(@Body() newItems: any[]) {
    return await this.appService.addData(newItems);
  }

  @Patch('update')
  async updateData(@Body() editedItems: { id: number; changes: any }[]) {
    return await this.appService.updateData(editedItems);
  }

  @Delete('delete')
  async deleteData(@Body() idsToDelete: number[]) {
    return await this.appService.deleteData(idsToDelete);
  }
}
