import { hashSync } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'password' })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @BeforeInsert()
  hasPassword() {
    this.password = hashSync(this.password, 10);
  }

  constructor(users: Partial<UsersEntity>) {
    this.id = users?.id;
    this.userName = users?.userName;
    this.password = users?.password;
    this.updatedAt = users?.updatedAt;
    this.deletedAt = users?.deletedAt;
  }
}
