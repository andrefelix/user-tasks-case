import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksEntity } from './entity/tasks.entity';
import { UsersEntity } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const authenticatedUser = {
  id: 'authenticated.id',
  userName: 'authenticated.username',
};
const newTask = { name: 'new task' };

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<TasksEntity>;
  let usersRepository: Repository<UsersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TasksEntity),
          useValue: {
            create: jest.fn().mockReturnValue(newTask),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue({}),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<TasksEntity>>(
      getRepositoryToken(TasksEntity),
    );
    usersRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
    expect(tasksRepository).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    const createArgs = {
      data: { ...newTask },
      authenticatedUser,
    };

    it('should create a new task', async () => {
      const result = await tasksService.create(createArgs);

      expect(result).toEqual(newTask);
      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
      expect(tasksRepository.create).toBeCalledTimes(1);
      expect(tasksRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should throw a not found exception error', () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValueOnce(null);

      expect(tasksService.create(createArgs)).rejects.toThrowError(
        NotFoundException,
      );
      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
      expect(tasksRepository.create).not.toBeCalled();
      expect(tasksRepository.save).not.toBeCalled();
      expect(usersRepository.save).not.toBeCalled();
    });
  });
});
