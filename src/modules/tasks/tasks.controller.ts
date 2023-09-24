import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksEntity } from './entity/tasks.entity';
import {
  BadRequestExceptionSwagger,
  NotFoundExceptionSwagger,
} from 'src/helpers/errors.swagger';
import { MESSAGE } from 'src/helpers/message';

@Controller('api/v1/tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retorna lista de tasks do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tasks retornada com sucesso',
    type: [TasksEntity],
  })
  @ApiResponse({
    status: 404,
    description: MESSAGE.notFoundUser,
    type: NotFoundExceptionSwagger,
  })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma nova task' })
  @ApiResponse({
    status: 200,
    description: 'Task criada com sucesso',
    type: TasksEntity,
  })
  @ApiResponse({
    status: 404,
    description: MESSAGE.notFoundUser,
    type: NotFoundExceptionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'A propriedade name deve ser fornecida',
    type: BadRequestExceptionSwagger,
  })
  create(@Body() body: TaskDTO, @Request() req) {
    return this.tasksService.create({
      data: body,
      authenticatedUser: req.user,
    });
  }
}
