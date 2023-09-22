import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Encryptor } from '../../helpers/encryptor';
import { BadRequestException } from '@nestjs/common';
import {
  mockUserEntity,
  mockUserDTO,
  mockLoginToken,
} from '../../helpers/test-helpers';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let encryptor: Encryptor;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ ...mockUserEntity }),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue(mockLoginToken.token) },
        },
        {
          provide: Encryptor,
          useValue: {
            hashSync: jest.fn(),
            compareSync: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    encryptor = module.get<Encryptor>(Encryptor);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a validated user', async () => {
      const result = await authService.validateUser({ ...mockUserEntity });

      expect(result).toEqual(mockUserEntity);
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).toBeCalledTimes(1);
    });

    it('should return null when no user is founded', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.validateUser({ ...mockUserEntity });

      expect(result).toBeNull();
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).not.toBeCalled();
    });

    it('should return null when no match password', async () => {
      jest.spyOn(encryptor, 'compareSync').mockReturnValueOnce(false);

      const result = await authService.validateUser({ ...mockUserEntity });

      expect(result).toBeNull();
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).toBeCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return jwt token', async () => {
      const result = await authService.login({ ...mockUserEntity });

      expect(result).toEqual(mockLoginToken);
      expect(jwtService.sign).toBeCalledTimes(1);
    });
  });

  describe('signup', () => {
    it('should create a user sucessuflly', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.signup(mockUserDTO);

      expect(result).toEqual({ message: 'Usuário criado com suceso' });
      expect(userService.findOne).toBeCalledTimes(1);
      expect(userService.create).toBeCalledTimes(1);
    });

    it('should throw a bad request exception', () => {
      expect(authService.signup(mockUserDTO)).rejects.toThrowError(
        BadRequestException,
      );
      expect(userService.findOne).toBeCalledTimes(1);
      expect(userService.create).not.toBeCalled();
    });
  });
});
