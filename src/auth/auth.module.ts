import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { PrismaModule } from 'src/prisma';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
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
