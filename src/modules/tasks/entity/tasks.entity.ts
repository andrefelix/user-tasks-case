import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../../users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToOne(() => UsersEntity, (user) => user.tasks)
  user: UsersEntity;
}
