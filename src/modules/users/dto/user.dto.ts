import { IsNotEmpty, Matches } from 'class-validator';
import { MESSAGE } from '../../../helpers/message';
import { REGEX } from '../../../helpers/regex';

export class UserDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  password: string;

  constructor(user: UserDTO) {
    this.userName = user.userName;
    this.password = user.password;
  }
}
