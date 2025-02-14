import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CLIENTS_SERVICE_AUTH, envs } from 'src/config';

import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ClientsModule.register([
      {
        name: CLIENTS_SERVICE_AUTH,
        transport: Transport.TCP,
        options: {
          port: 3002,
          host: 'localhost',
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          secret: envs.jwtSecret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    JwtModule,
  ],
})
export class AuthModule {}
