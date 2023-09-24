import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { Encryptor } from 'src/helpers/encryptor';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockRandomUUID, mockUserEntity } from 'src/helpers/test-helpers';
import { UpdateUserDTO } from 'src/modules/users/dto/update-user.dto';

const BASE_URL = '/api/v1/users';
const usersEntityList = [mockUserEntity];
const updateUser: UpdateUserDTO = { password: 'updated.password' };

describe('UsersController', () => {
  let usersController: UsersController;
  let app: INestApplication;
  let jwtService: JwtService;
  let mockHeaderAuthorization: string;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          privateKey: process.env.JWT_PRIVATE_KEY,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(usersEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(mockUserEntity),
            update: jest.fn().mockResolvedValue(updateUser),
            delete: jest.fn(),
          },
        },
        { provide: Encryptor, useValue: {} },
        JwtStrategy,
        JwtService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);

    const token = jwtService.sign({ sub: 'any.id', userName: 'any.userName ' });
    mockHeaderAuthorization = `Bearer ${token}`;

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('/GET findAll', () => {
    it('should return array of users', () => {
      return request(app.getHttpServer())
        .get(BASE_URL)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(usersEntityList);
        });
    });
  });

  describe('/GET findById', () => {
    it('should return a founded user', () => {
      return request(app.getHttpServer())
        .get(`${BASE_URL}/${mockRandomUUID}`)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(mockUserEntity);
        });
    });

    it('should throw a not found exception error', () => {
      jest
        .spyOn(usersService, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());

      return request(app.getHttpServer())
        .get(`${BASE_URL}/${mockRandomUUID}`)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/PUT update', () => {
    it('should return a updated user', () => {
      return request(app.getHttpServer())
        .put(`${BASE_URL}/${mockRandomUUID}`)
        .send(updateUser)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(updateUser);
        });
    });

    it('should throw a bad request exception error', () => {
      jest
        .spyOn(usersService, 'update')
        .mockRejectedValueOnce(new BadRequestException());

      return request(app.getHttpServer())
        .put(`${BASE_URL}/${mockRandomUUID}`)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw a not found exception error', () => {
      jest
        .spyOn(usersService, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      return request(app.getHttpServer())
        .put(`${BASE_URL}/${mockRandomUUID}`)
        .send(updateUser)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/DELETE delete', () => {
    it('should delete a user', () => {
      return request(app.getHttpServer())
        .delete(`${BASE_URL}/${mockRandomUUID}`)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should throw a not found exception error', () => {
      jest
        .spyOn(usersService, 'delete')
        .mockRejectedValueOnce(new NotFoundException());

      return request(app.getHttpServer())
        .delete(`${BASE_URL}/${mockRandomUUID}`)
        .set('Authorization', mockHeaderAuthorization)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
