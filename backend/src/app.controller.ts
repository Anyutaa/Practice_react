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
}
