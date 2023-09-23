import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../users/dto/user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginTokenSwagger } from './swagger/login-token.swagger';
import {
  BadRequestExceptionSwagger,
  UnauthorizedExceptionSwagger,
} from 'src/helpers/errors.swagger';
import { MESSAGE } from 'src/helpers/message';
import { SignupSuccessSwagger } from './swagger/signup-sucess.swagger';

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validação de usuário e senha' })
  @ApiResponse({
    status: 200,
    description: 'Usuário logado com sucesso',
    type: LoginTokenSwagger,
  })
  @ApiResponse({
    status: 401,
    description: MESSAGE.invalidAuthentication,
    type: UnauthorizedExceptionSwagger,
  })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Criação de um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com suceso',
    type: SignupSuccessSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'O username já está sendo usado',
    type: BadRequestExceptionSwagger,
  })
  signup(@Body() body: UserDTO) {
    return this.authService.signup(body);
  }
}
