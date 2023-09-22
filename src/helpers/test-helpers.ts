import { UserDTO } from '../modules/users/dto/user.dto';
import { UsersEntity } from '../modules/users/entity/users.entity';

export const mockUserEntity = new UsersEntity({
  id: 'any.id',
  userName: 'any.userName',
  password: 'any.password',
});

export const mockUserDTO = new UserDTO({ ...mockUserEntity });

export const mockLoginToken = { token: 'any.jwt.token' };
