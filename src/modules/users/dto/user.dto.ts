import { IsNotEmpty, Matches } from 'class-validator';
import { MESSAGE } from '../../../helpers/message';
import { REGEX } from '../../../helpers/regex';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @IsNotEmpty({ message: 'O userName deve ser fornecido' })
  @ApiProperty()
  userName: string;

  @IsNotEmpty({ message: 'O password deve ser fornecido' })
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  @ApiProperty()
  password: string;
}
