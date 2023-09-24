import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDTO } from './dto/task.dto';
import { UsersEntity } from '../users/entity/users.entity';
import { MESSAGE } from '../../helpers/message';
import { Repository } from 'typeorm';
import { TasksEntity } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUserDTO } from '../auth/dto/authenticated-user.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private tasksRepository: Repository<TasksEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll(authenticatedUser: AuthenticatedUserDTO) {
    const user = await this.usersRepository.findOne({
      where: { id: authenticatedUser.id },
      relations: ['tasks'],
    });

    if (!user) {
      throw new NotFoundException(MESSAGE.notFoundUser);
    }

    return user.tasks;
  }

  async create({
    data,
    authenticatedUser,
  }: {
    data: TaskDTO;
    authenticatedUser: AuthenticatedUserDTO;
  }) {
    let user: UsersEntity;

    try {
      user = await this.usersRepository.findOneOrFail({
        where: { id: authenticatedUser.id },
      });
    } catch (error) {
      throw new NotFoundException(MESSAGE.notFoundUser);
    }

    const task = this.tasksRepository.create(data);
    await this.tasksRepository.save(task);

    user.tasks = [task];

    await this.usersRepository.save(user);

    return task;
  }
}
