import { Injectable } from '@nestjs/common';
import { Encryptor } from 'src/helpers/encryptor';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !Encryptor.compareSync(user.password, password)) {
      return null;
    }

    return user;
  }
}
