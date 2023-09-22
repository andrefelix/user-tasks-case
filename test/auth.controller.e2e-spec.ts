import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalEstrategy } from 'src/modules/auth/estrategies/local.estrategy';
import { UsersEntity } from 'src/modules/users/entity/users.entity';
import { UserDTO } from 'src/modules/users/dto/user.dto';
import { MESSAGE } from 'src/helpers/message';

const userEntity = new UsersEntity({
  id: 'any.id',
  userName: 'any.userName',
  password: 'any.password',
});

const userDTO = new UserDTO({ ...userEntity });

const loginToken = { token: 'any.jwt.token' };

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalEstrategy,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ ...loginToken }),
            validateUser: jest.fn().mockResolvedValue({ ...userEntity }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it(`/POST login sucessfully`, () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ ...userDTO })
      .expect(HttpStatus.OK, loginToken);
  });

  it(`/POST login unauthorized`, () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

    const unauthorizedBody = {
      message: MESSAGE.invalidAuthentication,
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized',
    };

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ ...userDTO })
      .expect(HttpStatus.UNAUTHORIZED, unauthorizedBody);
  });

  afterAll(async () => {
    await app.close();
  });
});
