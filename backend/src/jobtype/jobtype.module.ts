import { Module } from '@nestjs/common';
import { JobtypeService } from './jobtype.service';
import { JobtypeController } from './jobtype.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JobtypeController],
  providers: [JobtypeService, PrismaService],
  exports: [JobtypeService],
})
export class JobtypeModule {}