import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { JobtypeModule } from './jobtype/jobtype.module';
import { WorkmodeModule } from './workmode/workmode.module';
import { ExperienceLevelModule } from './experience-level/experience-level.module';
import { EducationLevelModule } from './education-level/education-level.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, JobtypeModule, WorkmodeModule, ExperienceLevelModule, EducationLevelModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
