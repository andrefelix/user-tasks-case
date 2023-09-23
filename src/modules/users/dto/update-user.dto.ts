import { PartialType } from '@nestjs/mapped-types';
import { UserDTO } from './user.dto';
import { IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @IsUUID()
  @ApiPropertyOptional()
  id: string;

  constructor(user: Partial<UpdateUserDTO>) {
    super(user);
    this.id = user?.id;
    this.userName = user?.userName;
    this.password = user?.password;
  }
}
