import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsDateString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Full Stack Developer' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'We are looking for an experienced developer...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: false, example: 'Build and maintain web applications...' })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiProperty({ required: false, example: '5+ years of experience in React and Node.js...' })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  jobTypeId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  workModeId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  experienceLevelId: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  educationLevelId?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  locationId: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiProperty({ example: 3, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  vacancies?: number;

  @ApiProperty({ required: false, example: 50000 })
  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @ApiProperty({ required: false, example: 80000 })
  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @ApiProperty({ default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  applyDeadline?: string;

  @ApiProperty({ default: 'draft' })
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published', 'closed'])
  status?: string;

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  skillIds?: number[];

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  benefitIds?: number[];
}