import { IsNotEmpty } from 'class-validator';

export class TaskDTO {
  @IsNotEmpty({ message: 'A propriedade name deve ser fornecida' })
  name: string;
}
