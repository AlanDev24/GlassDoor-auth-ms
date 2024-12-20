import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() regosterDto: RegisterUserDto) {
    return this.authService.registerUser(regosterDto);
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser() {
    return this.authService.loginUser();
  }
}
