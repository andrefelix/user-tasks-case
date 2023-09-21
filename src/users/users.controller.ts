import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOneOrFail(id);
  }

  @Post()
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.update({ id, data: body });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.delete(id);
  }
}
