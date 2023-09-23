import { ApiProperty } from '@nestjs/swagger';

export class SignupSuccessSwagger {
  @ApiProperty()
  message: string;
}
