import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksEntity } from './entity/tasks.entity';
import { UsersEntity } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  mockAuthenticatedUser,
  mockTaskEntity,
  mockTaskEntityList,
  mockUserEntity,
} from '../../helpers/test-helpers';

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
            create: jest.fn().mockReturnValue(mockTaskEntity),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue({ tasks: [] }),
            save: jest.fn(),
            findOne: jest.fn().mockResolvedValue({
              ...mockUserEntity,
              tasks: mockTaskEntityList,
            }),
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
      data: { ...mockTaskEntity },
      authenticatedUser: { ...mockAuthenticatedUser },
    };

    it('should create a new task', async () => {
      const result = await tasksService.create(createArgs);

      expect(result).toEqual(mockTaskEntity);
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

  describe('findAll', () => {
    it('should return a task list', async () => {
      const result = await tasksService.findAll({ ...mockAuthenticatedUser });

      expect(result).toEqual(mockTaskEntityList);
      expect(usersRepository.findOne).toBeCalledTimes(1);
    });

    it('should throw not found exception', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      expect(
        tasksService.findAll({ ...mockAuthenticatedUser }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
