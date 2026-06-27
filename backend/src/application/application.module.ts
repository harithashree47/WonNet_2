import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule],
  controllers: [ApplicationController],
  providers: [ApplicationService,PrismaService],
})
export class ApplicationModule {}
