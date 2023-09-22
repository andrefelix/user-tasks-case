import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalEstrategy } from 'src/modules/auth/estrategies/local.estrategy';
import { MESSAGE } from 'src/helpers/message';
import {
  mockUserEntity,
  mockUserDTO,
  mockLoginToken,
} from 'src/helpers/test-helpers';

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
            login: jest.fn().mockResolvedValue({ ...mockLoginToken }),
            validateUser: jest.fn().mockResolvedValue({ ...mockUserEntity }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('/POST login', () => {
    it(`should return login token sucessfully`, () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.OK, mockLoginToken);
    });

    it(`should refuse access with unauthorized exception`, () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      const unauthorizedBody = {
        message: MESSAGE.invalidAuthentication,
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.UNAUTHORIZED, unauthorizedBody);
    });
  });
});
