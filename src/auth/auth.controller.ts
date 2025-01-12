import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtPaylaod } from './interfaces';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() regosterDto: RegisterUserDto) {
    return this.authService.registerUser(regosterDto);
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @MessagePattern({ cmd: 'edit_user' })
  async editUser(@Payload() user: JwtPaylaod) {
    return user
  }
}
