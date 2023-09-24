import { randomUUID } from 'crypto';
import { UserDTO } from '../modules/users/dto/user.dto';
import { UsersEntity } from '../modules/users/entity/users.entity';
import { TasksEntity } from 'src/modules/tasks/entity/tasks.entity';

export const mockRandomUUID = randomUUID();

export const mockUserEntity: UsersEntity = {
  id: 'any.id',
  userName: 'any.userName',
  password: 'any.password',
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
  tasks: undefined,
};

export const mockUserDTO = { ...mockUserEntity } as UserDTO;

export const mockLoginToken = { token: 'any.jwt.token' };

export const mockAuthenticatedUser = {
  id: 'authenticated.id',
  userName: 'authenticated.username',
};

export const mockTaskEntity = { id: 'any.id', name: 'new task' } as TasksEntity;
export const mockTaskEntityList = [{ ...mockTaskEntity }];
