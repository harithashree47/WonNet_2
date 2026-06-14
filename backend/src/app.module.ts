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
import { DepartmentModule } from './department/department.module';
import { CompanyModule } from './company/company.module';
import { UploadModule } from './upload/upload.module';
import { SkillModule } from './skill/skill.module';
import { BenefitModule } from './benefit/benefit.module';
@Module({
  imports: [UserModule, AuthModule, CategoryModule, JobtypeModule, WorkmodeModule, ExperienceLevelModule, EducationLevelModule, LocationModule, DepartmentModule, CompanyModule, UploadModule, SkillModule, BenefitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
