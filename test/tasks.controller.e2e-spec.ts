import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TasksController } from 'src/modules/tasks/tasks.controller';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { TaskDTO } from 'src/modules/tasks/dto/task.dto';
import { mockTaskEntity, mockTaskEntityList } from 'src/helpers/test-helpers';

const BASE_URL = '/api/v1/tasks';

describe('TasksController', () => {
  let app: INestApplication;
  let tasksController: TasksController;
  let tasksService: TasksService;
  let jwtService: JwtService;
  let mockHeaderAuthorization: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          privateKey: process.env.JWT_PRIVATE_KEY,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTaskEntity),
            findAll: jest.fn().mockResolvedValue(mockTaskEntityList),
          },
        },
        JwtStrategy,
        JwtService,
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
    jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({ sub: 'any.id', userName: 'any.userName ' });
    mockHeaderAuthorization = `Bearer ${token}`;

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
    expect(tasksService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('/POST create', () => {
    const createTask: TaskDTO = { name: 'any task name' };

    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .send(createTask)
        .expect(HttpStatus.CREATED, mockTaskEntity);
    });

    it('should throw not found exception when current user is not founded', () => {
      jest
        .spyOn(tasksService, 'create')
        .mockRejectedValueOnce(new NotFoundException());

      return request(app.getHttpServer())
        .post(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .send(createTask)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw bad request exception when body is not sended', () => {
      jest
        .spyOn(tasksService, 'create')
        .mockRejectedValueOnce(new BadRequestException());

      return request(app.getHttpServer())
        .post(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/GET findAll', () => {
    it('should return a task list', () => {
      return request(app.getHttpServer())
        .get(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.OK, mockTaskEntityList);
    });

    it('should throw not found exception when current user is not founded', () => {
      jest
        .spyOn(tasksService, 'findAll')
        .mockRejectedValueOnce(new NotFoundException());

      return request(app.getHttpServer())
        .get(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
