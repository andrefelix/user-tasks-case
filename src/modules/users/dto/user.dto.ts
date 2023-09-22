import { IsNotEmpty, Matches } from 'class-validator';
import { MESSAGE } from 'src/helpers/message';
import { REGEX } from 'src/helpers/regex';

export class UserDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  password: string;
}
