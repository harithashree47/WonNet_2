import { PartialType } from '@nestjs/mapped-types';
import { CreateJobtypeDto } from './create-jobtype.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateJobtypeDto extends PartialType(CreateJobtypeDto) {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}