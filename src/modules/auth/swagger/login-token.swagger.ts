import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenSwagger {
  @ApiProperty()
  token: string;
}
