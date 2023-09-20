import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDTO } from './dto/users.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOneOrFail(id);
  }

  @Post()
  create(@Body() body: UsersDTO) {
    return this.usersService.create(body);
  }

  @Put(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UsersDTO) {
    return this.usersService.update({ id, data: body });
  }

  @Delete()
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.delete(id);
  }
}
