import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById() {
    return this.usersService.findById();
  }

  @Post()
  create() {
    return this.usersService.create();
  }

  @Put()
  update() {
    return this.usersService.update();
  }

  @Delete()
  delete() {
    return this.usersService.delete();
  }
}
