import { randomUUID } from 'crypto';
import { UserDTO } from '../modules/users/dto/user.dto';
import { UsersEntity } from '../modules/users/entity/users.entity';

export const mockRandomUUID = randomUUID();

export const mockUserEntity = new UsersEntity({
  id: 'any.id',
  userName: 'any.userName',
  password: 'any.password',
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
});

export const mockUserDTO = new UserDTO({ ...mockUserEntity });

export const mockLoginToken = { token: 'any.jwt.token' };
