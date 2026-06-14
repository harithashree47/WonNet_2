import { Module } from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { BenefitController } from './benefit.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BenefitController],
  providers: [BenefitService, PrismaService],
  exports: [BenefitService],
})
export class BenefitModule {}