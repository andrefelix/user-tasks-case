import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Encryptor } from '../../helpers/encryptor';
import { UserDTO } from './dto/user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { MESSAGE } from '../../helpers/message';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private encryptor: Encryptor,
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
      throw new NotFoundException(MESSAGE.notFoundUser);
    }
  }

  async findOne(options: FindOneOptions<UsersEntity>) {
    try {
      return await this.usersRepository.findOne(options);
    } catch (error) {
      return null;
    }
  }

  async create(data: UserDTO) {
    const user = this.usersRepository.create({
      ...data,
      password: this.encryptor.hashSync(data.password),
    });

    return await this.usersRepository.save(user);
  }

  async update(args: {
    id: string;
    data: UpdateUserDTO;
    userInfo: Partial<UsersEntity>;
  }) {
    const { id, data, userInfo } = args;

    if (userInfo.id !== id) {
      throw new ForbiddenException('Atualização de senha negada');
    }

    const user = await this.findOneOrFail(id);

    data.password = this.encryptor.hashSync(data.password);
    this.usersRepository.merge(user, data);

    await this.usersRepository.save(user);

    return { message: 'Senha alterada com sucesso' };
  }

  async delete(id: string) {
    await this.findOneOrFail(id);
    await this.usersRepository.softDelete(id);
  }
}
