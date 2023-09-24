import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: TaskDTO, @Request() req) {
    return this.tasksService.create({ data: body, userInfo: req.user });
  }
}
