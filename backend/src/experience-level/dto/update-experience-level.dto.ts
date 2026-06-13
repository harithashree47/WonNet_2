import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceLevelDto } from './create-experience-level.dto';
import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';

export class UpdateExperienceLevelDto extends PartialType(CreateExperienceLevelDto) {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minYears?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxYears?: number;
}