import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './entity/tasks.entity';
import { UsersEntity } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity, UsersEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
