import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('User-service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('User service working');
  }
  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, phoneNumber, password } = registerUserDto;

    try {
      return this.user.create({
        data: {
          name,
          email,
          phoneNumber,
          password,
        },
      });
    } catch (error) {
      this.logger.log(`An error has ocurred ${error}`);
    }
  }

  async loginUser() {
    return 'Logeando usuario';
  }
}
