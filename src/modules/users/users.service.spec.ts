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
    usersEntityRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
    encryptor = module.get<Encryptor>(Encryptor);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersEntityRepository).toBeDefined();
    expect(encryptor).toBeDefined();
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

  describe('findOne', () => {
    const findOneOptions = { where: { id: mockUserEntity.id } };

    it('should return a founded user', async () => {
      const result = await usersService.findOne(findOneOptions);

      expect(result).toEqual(mockUserEntity);
      expect(usersEntityRepository.findOne).toBeCalledTimes(1);
    });

    it('should return null', async () => {
      jest.spyOn(usersEntityRepository, 'findOne').mockRejectedValueOnce(null);

      const result = await usersService.findOne(findOneOptions);

      expect(result).toBeNull();
      expect(usersEntityRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await usersService.create(mockUserDTO);

      expect(result).toEqual(mockUserDTO);
      expect(usersEntityRepository.create).toBeCalledTimes(1);
      expect(usersEntityRepository.save).toBeCalledTimes(1);
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
        .spyOn(usersEntityRepository, 'save')
        .mockResolvedValueOnce(updatedUserDTO as UsersEntity);

      const result = await usersService.update({
        id: userId,
        data: { ...updatedUserDTO },
      });

      expect(result).toEqual(updatedUserDTO);
      expect(usersEntityRepository.findOneOrFail).toBeCalledTimes(1);
      expect(usersEntityRepository.merge).toBeCalledTimes(1);
      expect(usersEntityRepository.save).toBeCalledTimes(1);
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
  });
});
