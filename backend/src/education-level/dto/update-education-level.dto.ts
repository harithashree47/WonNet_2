import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationLevelDto } from './create-education-level.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateEducationLevelDto extends PartialType(CreateEducationLevelDto) {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}