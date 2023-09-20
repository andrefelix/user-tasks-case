import { IsNotEmpty } from 'class-validator';

export class UsersDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
