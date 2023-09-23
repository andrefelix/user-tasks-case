import { ApiProperty } from '@nestjs/swagger';

class GenericError {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}

export class UnauthorizedExceptionSwagger extends GenericError {}

export class BadRequestExceptionSwagger extends GenericError {}

export class NotFoundExceptionSwagger extends GenericError {}
