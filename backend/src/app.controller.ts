import { 
  Controller, Get, Post, 
  Body, Patch, Param, Delete, Query 
} from '@nestjs/common';
import { AppService } from './app.service';


@Controller('data')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getData() {
    return this.appService.getData(); 
  }
 @Post('add')
  addData(@Body() newItems: any[]) {
    return this.appService.addData(newItems);
  }

  @Patch('update')
  updateData(@Body() editedItems: { id: number, changes: any }[]) {
    return this.appService.updateData(editedItems);
  }

  @Delete('delete')
  deleteData(@Body() idsToDelete: number[]) {
    return this.appService.deleteData(idsToDelete);
  }
}
