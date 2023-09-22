import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encryptor } from '../../helpers/encryptor';
import { CreateUserDTO } from 'src/modules/users/dto/create-user.dto';
import { UsersEntity } from 'src/modules/users/entity/users.entity';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private encryptor: Encryptor,
  ) {}

  async validateUser({ userName, password }: CreateUserDTO) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !this.encryptor.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: UsersEntity) {
    const payload = { sub: user.id, userName: user.userName };

    return { token: this.jwtService.sign(payload) };
  }

  async signup(data: CreateUserDTO) {
    const { userName } = data;
    const foundUser = await this.userService.findOne({ where: { userName } });

    if (foundUser) {
      throw new BadRequestException('O username já está sendo usado');
    }

    await this.userService.create(data);

    return { message: 'Usuário criado com suceso' };
  }
}