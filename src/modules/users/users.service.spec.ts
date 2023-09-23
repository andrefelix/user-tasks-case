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
  let usersRepository: Repository<UsersEntity>;
  let encryptor: Encryptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockUserEntity]),
            findOneOrFail: jest.fn().mockResolvedValue(mockUserDTO),
            findOne: jest.fn().mockResolvedValue(mockUserEntity),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockUserDTO),
            merge: jest.fn(),
          },
        },
        {
          provide: Encryptor,
          useValue: {
            hashSync: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
    encryptor = module.get<Encryptor>(Encryptor);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(encryptor).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await usersService.findAll();

      expect(result).toEqual([mockUserEntity]);
      expect(usersRepository.find).toBeCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a founded user', async () => {
      const result = await usersService.findOneOrFail(mockUserEntity.id);

      expect(result).toEqual(mockUserDTO);
      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
    });

    it('should throw a not found exception error', async () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValueOnce(null);

      expect(
        usersService.findOneOrFail(mockUserEntity.id),
      ).rejects.toThrowError(NotFoundException);
      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const findOneOptions = { where: { id: mockUserEntity.id } };

    it('should return a founded user', async () => {
      const result = await usersService.findOne(findOneOptions);

      expect(result).toEqual(mockUserEntity);
      expect(usersRepository.findOne).toBeCalledTimes(1);
    });

    it('should return null', async () => {
      jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(null);

      const result = await usersService.findOne(findOneOptions);

      expect(result).toBeNull();
      expect(usersRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await usersService.create(mockUserDTO);

      expect(result).toEqual(mockUserDTO);
      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const userId = mockUserDTO.id;
    const updatedUserDTO = {
      id: mockUserEntity.id,
      userName: 'updated name',
    };

    it('should update a user', async () => {
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValueOnce(updatedUserDTO as UsersEntity);

      const result = await usersService.update({
        id: userId,
        data: { ...updatedUserDTO },
      });

      expect(result).toEqual(updatedUserDTO);
      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
      expect(usersRepository.merge).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should not hash a sended password', async () => {
      await usersService.update({
        id: userId,
        data: { ...updatedUserDTO, password: 'any' },
      });

      expect(encryptor.hashSync).toBeCalledTimes(1);
    });

    it('should not hash a not sended password', async () => {
      await usersService.update({
        id: userId,
        data: { ...updatedUserDTO },
      });

      expect(encryptor.hashSync).not.toBeCalled();
    });

    it('should throw not found exception', () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValueOnce(null);

      expect(
        usersService.update({
          id: userId,
          data: { ...updatedUserDTO },
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
