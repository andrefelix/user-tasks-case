import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { REGEX } from 'src/helpers/regex';
import { MESSAGE } from 'src/helpers/message';

export class UpdateUserDTO {
  @IsNotEmpty({ message: 'O novo password deve ser fornecido' })
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  @ApiProperty()
  password: string;
}
