import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encryptor } from '../../helpers/encryptor';
import { UserDTO } from 'src/modules/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthenticatedUserDTO } from './dto/authenticated-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private encryptor: Encryptor,
  ) {}

  async validateUser({ userName, password }: UserDTO) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !this.encryptor.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: AuthenticatedUserDTO) {
    const payload = { sub: user.id, userName: user.userName };

    return { token: this.jwtService.sign(payload) };
  }

  async signup(data: UserDTO) {
    const { userName } = data;
    const foundUser = await this.userService.findOne({ where: { userName } });

    if (foundUser) {
      throw new BadRequestException('O username já está sendo usado');
    }

    await this.userService.create(data);

    return { message: 'Usuário criado com suceso' };
  }
}
