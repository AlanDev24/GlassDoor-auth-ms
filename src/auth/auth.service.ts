import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma';
import { JwtPaylaod } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('User-service');
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('User service working');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, phoneNumber, password } = registerUserDto;

    const userExist = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Email alredy in use',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashPassword,
      },
    });

    const { isActive, roles } = newUser;

    const token = await this.signToken({ email, isActive, roles });

    return {
      user: newUser.name,
      token: token,
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!existUser) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    const { password: userPassword, isActive, roles, ...rest } = existUser;

    const correctPassword = bcrypt.compareSync(password, userPassword);

    if (!correctPassword) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Wrong email or password',
      });
    }

    const token = await this.signToken({ email, isActive, roles });

    return {
      status: HttpStatus.ACCEPTED,
      ...rest,
      token,
    };
  }

  async signToken(payload: JwtPaylaod) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
