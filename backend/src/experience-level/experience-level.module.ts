import { Module } from '@nestjs/common';
import { ExperienceLevelService } from './experience-level.service';
import { ExperienceLevelController } from './experience-level.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExperienceLevelController],
  providers: [ExperienceLevelService, PrismaService],
  exports: [ExperienceLevelService],
})
export class ExperienceLevelModule {}