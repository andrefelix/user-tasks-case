import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from './entity/users.entity';
import {
  BadRequestExceptionSwagger,
  ForbiddenExceptionSwagger,
  NotFoundExceptionSwagger,
} from 'src/helpers/errors.swagger';

@Controller('api/v1/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Busca lista de usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UsersEntity],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundExceptionSwagger,
  })
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOneOrFail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Altera senha do usuário' })
  @ApiResponse({
    status: 201,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Atualização de senha negada',
    type: ForbiddenExceptionSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundExceptionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'O novo password deve ser fornecido',
    type: BadRequestExceptionSwagger,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDTO,
    @Request() req,
  ) {
    return this.usersService.update({ id, data: body, userInfo: req.user });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta usuário pelo id' })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundExceptionSwagger,
  })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.delete(id);
  }
}
