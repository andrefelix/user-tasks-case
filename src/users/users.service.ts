import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UsersDTO } from './dto/users.dto';

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
      return await this.usersRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async create(data: UsersDTO) {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async update(args: { id: string; data: UsersDTO }) {
    const { id, data } = args;
    const user = await this.findOneOrFail(id);

    this.usersRepository.merge(user, data);

    return await this.usersRepository.save(user);
  }

  async delete(id: string) {
    await this.findOneOrFail(id);
    this.usersRepository.softDelete(id);
    return null;
  }
}
