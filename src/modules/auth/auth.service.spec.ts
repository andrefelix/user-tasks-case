import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/entity/users.entity';
import { Encryptor } from '../../helpers/encryptor';
import { UserDTO } from '../users/dto/user.dto';
import { BadRequestException } from '@nestjs/common';

const userEntity = new UsersEntity({
  id: 'any.id',
  userName: 'any.userName',
  password: 'any.password',
});

const userDTO = new UserDTO({ ...userEntity });

const jwtToken = 'any.jwt.token';

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
            findOne: jest.fn().mockResolvedValue({ ...userEntity }),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue(jwtToken) },
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
      const result = await authService.validateUser({ ...userEntity });

      expect(result).toEqual(userEntity);
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).toBeCalledTimes(1);
    });

    it('should return null when no user is founded', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.validateUser({ ...userEntity });

      expect(result).toBeNull();
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).not.toBeCalled();
    });

    it('should return null when no match password', async () => {
      jest.spyOn(encryptor, 'compareSync').mockReturnValueOnce(false);

      const result = await authService.validateUser({ ...userEntity });

      expect(result).toBeNull();
      expect(userService.findOne).toBeCalledTimes(1);
      expect(encryptor.compareSync).toBeCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return jwt token', async () => {
      const result = await authService.login({ ...userEntity });

      expect(result).toEqual({ token: jwtToken });
      expect(jwtService.sign).toBeCalledTimes(1);
    });
  });

  describe('signup', () => {
    it('should create a user sucessuflly', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.signup(userDTO);

      expect(result).toEqual({ message: 'Usuário criado com suceso' });
      expect(userService.findOne).toBeCalledTimes(1);
      expect(userService.create).toBeCalledTimes(1);
    });

    it('should throw a bad request exception', () => {
      expect(authService.signup(userDTO)).rejects.toThrowError(
        BadRequestException,
      );
      expect(userService.findOne).toBeCalledTimes(1);
      expect(userService.create).not.toBeCalled();
    });
  });
});
