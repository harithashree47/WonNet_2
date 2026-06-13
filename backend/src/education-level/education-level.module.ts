import { Module } from '@nestjs/common';
import { EducationLevelService } from './education-level.service';
import { EducationLevelController } from './education-level.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EducationLevelController],
  providers: [EducationLevelService, PrismaService],
  exports: [EducationLevelService],
})
export class EducationLevelModule {}