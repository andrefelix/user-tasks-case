import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Encryptor } from '../../helpers/encryptor';
import { mockUserEntity } from '../../helpers/test-helpers';

describe('AuthService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockUserEntity]),
          },
        },
        {
          provide: Encryptor,
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await usersService.findAll();

      expect(result).toEqual([mockUserEntity]);
    });
  });
});
