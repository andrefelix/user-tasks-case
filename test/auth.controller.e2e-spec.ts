import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import {
  mockUserEntity,
  mockUserDTO,
  mockLoginToken,
} from 'src/helpers/test-helpers';

const BASE_URL = '/api/v1/auth';
const mockUserCreatedSucessfully = { message: 'Usuário criado com suceso' };

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ ...mockLoginToken }),
            validateUser: jest.fn().mockResolvedValue({ ...mockUserEntity }),
            signup: jest.fn().mockResolvedValue(mockUserCreatedSucessfully),
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
        .post(BASE_URL + '/login')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.OK, mockLoginToken);
    });

    it(`should refuse access with unauthorized exception when credentials is not sended`, () => {
      return request(app.getHttpServer())
        .post(BASE_URL + '/login')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it(`should refuse access with unauthorized exception when invalid credentials are sended`, () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      return request(app.getHttpServer())
        .post(BASE_URL + '/login')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/POST signup', () => {
    it(`should return created user sucessfully`, () => {
      return request(app.getHttpServer())
        .post(BASE_URL + '/signup')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.CREATED, mockUserCreatedSucessfully);
    });

    it(`should thow bad request exception error`, () => {
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValueOnce(new BadRequestException());

      return request(app.getHttpServer())
        .post(BASE_URL + '/signup')
        .send({ ...mockUserDTO })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
