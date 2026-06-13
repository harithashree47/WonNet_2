import { Module } from '@nestjs/common';
import { WorkmodeService } from './workmode.service';
import { WorkmodeController } from './workmode.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkmodeController],
  providers: [WorkmodeService, PrismaService],
  exports: [WorkmodeService],
})
export class WorkmodeModule {}