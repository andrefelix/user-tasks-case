import { UserDTO } from './user.dto';
import { IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @IsUUID()
  @ApiProperty()
  id: string;
}
