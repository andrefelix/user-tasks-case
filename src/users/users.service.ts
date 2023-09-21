import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Encryptor } from 'src/helpers/encryptor';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
        select: { id: true, userName: true },
      });
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async findOne(options: FindOneOptions<UsersEntity>) {
    return await this.usersRepository.findOne(options);
  }

  async create(data: CreateUserDTO) {
    const user = this.usersRepository.create({
      ...data,
      password: Encryptor.hashSync(data.password),
    });
    return await this.usersRepository.save(user);
  }

  async update(args: { id: string; data: UpdateUserDTO }) {
    const { id, data } = args;
    const user = await this.findOneOrFail(id);

    if (data.password) {
      data.password = Encryptor.hashSync(data.password);
    }

    this.usersRepository.merge(user, data);

    const updatedUser = await this.usersRepository.save(user);

    return {
      id: updatedUser.id,
      userName: updatedUser.userName,
    };
  }

  async delete(id: string) {
    await this.findOneOrFail(id);
    this.usersRepository.softDelete(id);
    return null;
  }
}
