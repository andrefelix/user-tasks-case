import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from 'src/modules/tasks/entity/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ name: 'user_name' })
  @ApiProperty()
  userName: string;

  @Column({ name: 'password' })
  @ApiProperty()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  constructor(users: Partial<UsersEntity>) {
    this.id = users?.id;
    this.userName = users?.userName;
    this.password = users?.password;
    this.updatedAt = users?.updatedAt;
    this.deletedAt = users?.deletedAt;
    this.tasks = users?.tasks;
  }
}
