import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Encryptor } from '../../helpers/encryptor';
import { mockUserDTO, mockUserEntity } from '../../helpers/test-helpers';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let usersService: UsersService;
  let usersEntityRepository: Repository<UsersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockUserEntity]),
            findOneOrFail: jest.fn().mockResolvedValue(mockUserDTO),
          },
        },
        {
          provide: Encryptor,
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersEntityRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersEntityRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await usersService.findAll();

      expect(result).toEqual([mockUserEntity]);
      expect(usersEntityRepository.find).toBeCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a founded user', async () => {
      const result = await usersService.findOneOrFail(mockUserEntity.id);

      expect(result).toEqual(mockUserDTO);
      expect(usersEntityRepository.findOneOrFail).toBeCalledTimes(1);
    });

    it('should throw a not found exception error', async () => {
      jest
        .spyOn(usersEntityRepository, 'findOneOrFail')
        .mockRejectedValueOnce(null);

      expect(
        usersService.findOneOrFail(mockUserEntity.id),
      ).rejects.toThrowError(NotFoundException);
      expect(usersEntityRepository.findOneOrFail).toBeCalledTimes(1);
    });
  });
});
