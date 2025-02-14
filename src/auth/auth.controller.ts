import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() registerDto: RegisterUserDto) {
    return this.authService.registerUser(registerDto);
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

}
