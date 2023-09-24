import { IsNotEmpty, Matches } from 'class-validator';
import { MESSAGE } from '../../../helpers/message';
import { REGEX } from '../../../helpers/regex';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @IsNotEmpty()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  @ApiProperty()
  password: string;
}
