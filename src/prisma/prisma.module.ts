import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//? Es necesario crear el modulo y aqui exportar el servicio
//? para que pueda ser inyectado en otros servicios.

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
