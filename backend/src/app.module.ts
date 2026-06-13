import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { JobtypeModule } from './jobtype/jobtype.module';
import { WorkmodeModule } from './workmode/workmode.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, JobtypeModule, WorkmodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
