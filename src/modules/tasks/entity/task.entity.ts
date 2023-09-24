import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from 'src/modules/users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToOne(() => UsersEntity, (user) => user.tasks)
  user: UsersEntity;
}
