import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPaylaod } from '../interfaces';
import { CLIENTS_SERVICE_AUTH, envs } from 'src/config';
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CLIENTS_SERVICE_AUTH) private readonly client: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: JwtPaylaod) {
    const { email, isActive } = payload;

    const userExist = await firstValueFrom(
      this.client.send({ cmd: 'find_by_email' }, { email }),
    );

    if (!userExist) throw new NotFoundException('User not found');

    if (!isActive) {
      throw new UnauthorizedException('This user is inactive');
    }

    // Si todo está bien, devolver el payload con el correo electrónico
    return payload;
  }
}
