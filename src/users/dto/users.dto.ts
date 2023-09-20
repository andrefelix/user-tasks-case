import { IsNotEmpty, Matches } from 'class-validator';
import { MESSAGE } from 'src/helpers/message';
import { REGEX } from 'src/helpers/regex';

export class UsersDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Matches(REGEX.password, { message: MESSAGE.passwordInvalid })
  password: string;
}
