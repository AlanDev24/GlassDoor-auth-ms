import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

//? Este servicio sirve como única instancia para ser agregada
//? en cualquier otro servicio que lo requiera.

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
