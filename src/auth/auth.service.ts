import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPaylaod } from './interfaces';
import { firstValueFrom } from 'rxjs';
import { CLIENTS_SERVICE_AUTH } from 'src/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('User-service');
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CLIENTS_SERVICE_AUTH) private readonly client: ClientProxy,
  ) {
    this.logger.log('User service working');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, phoneNumber, password, roles } = registerUserDto;
    const userExist = await firstValueFrom(
      this.client.send({ cmd: 'find_by_email' }, { email }),
    );

    if (userExist) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Email alredy in use',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await firstValueFrom(
      this.client.send(
        { cmd: 'create_user' },
        {
          name,
          email,
          phoneNumber,
          password: hashPassword,
          roles,
        },
      ),
    );

    const { isActive } = newUser;
    const token = await this.signToken({
      email,
      isActive,
      roles: newUser.roles,
    });

    return {
      user: newUser,
      token: token,
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    //* La respuesta al llamado del MS será un Observable de tipo any
    const userExist = await firstValueFrom(
      this.client.send({ cmd: 'find_by_email' }, { email }),
    );

    if (!userExist) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    const { password: userPassword, isActive, roles, ...rest } = userExist;

    if (!isActive) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'This user is inactive',
      });
    }

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
