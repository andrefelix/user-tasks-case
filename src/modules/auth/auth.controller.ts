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

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  signup(@Body() body: UserDTO) {
    return this.authService.signup(body);
  }
}
