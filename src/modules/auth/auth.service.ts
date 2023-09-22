import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encryptor } from 'src/helpers/encryptor';
import { CreateUserDTO } from 'src/modules/users/dto/create-user.dto';
import { UsersEntity } from 'src/modules/users/entity/users.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !Encryptor.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: UsersEntity) {
    console.log(user);
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
