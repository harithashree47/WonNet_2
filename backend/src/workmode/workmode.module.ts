import { Module } from '@nestjs/common';
import { WorkmodeService } from './workmode.service';
import { WorkmodeController } from './workmode.controller';

@Module({
  controllers: [WorkmodeController],
  providers: [WorkmodeService],
  exports: [WorkmodeService],
})
export class WorkmodeModule {}
