import { IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { MESSAGE } from '../../../helpers/message';
import { REGEX } from '../../../helpers/regex';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDTO {
  @IsUUID()
  @ApiPropertyOptional()
  id?: string;

  @IsNotEmpty()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @Matches(REGEX.password, { message: MESSAGE.invalidPassword })
  @ApiProperty()
  password: string;

  constructor(user: UserDTO) {
    this.id = user.id;
    this.userName = user.userName;
    this.password = user.password;
  }
}
