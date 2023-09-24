import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Encryptor } from '../../helpers/encryptor';
import { mockUserDTO, mockUserEntity } from '../../helpers/test-helpers';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';

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
            softDelete: jest.fn(),
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
    const updateUserId = 'update.user.id';
    const updateUser: UpdateUserDTO = { password: 'updated.password' };
    const userInfo: Partial<UsersEntity> = {
      id: updateUserId,
      userName: 'any.name',
    };

    it('should update a user', async () => {
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValueOnce(updateUser as UsersEntity);

      await usersService.update({
        id: updateUserId,
        data: { ...updateUser },
        userInfo,
      });

      expect(usersRepository.findOneOrFail).toBeCalledTimes(1);
      expect(encryptor.hashSync).toBeCalledTimes(1);
      expect(usersRepository.merge).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should throw forbidden exception error', () => {
      expect(
        usersService.update({
          id: 'invalid.id',
          data: { ...updateUser },
          userInfo,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw not found exception error', () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValueOnce(null);

      expect(
        usersService.update({
          id: updateUserId,
          data: { ...updateUser },
          userInfo,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      await usersService.delete('any.id');
    });

    it('should throw not found exception error', () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValueOnce(null);

      expect(usersService.delete('any.id')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
