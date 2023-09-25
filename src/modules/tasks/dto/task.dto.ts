import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TaskDTO {
  @IsNotEmpty({ message: 'A propriedade name deve ser fornecida' })
  @ApiProperty()
  name: string;
}
