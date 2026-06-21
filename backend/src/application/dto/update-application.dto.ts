import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({ 
    required: false,
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn']
  })
  @IsOptional()
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  @IsString()
  status?: string;

  @ApiProperty({ required: false, example: 'https://example.com/resume.pdf' })
  @IsOptional()
  @IsUrl()
  @IsString()
  resumeUrl?: string;

  @ApiProperty({ required: false, example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsUrl()
  @IsString()
  linkedin?: string;

  @ApiProperty({ required: false, example: 'https://portfolio.com' })
  @IsOptional()
  @IsUrl()
  @IsString()
  portfolio?: string;

  @ApiProperty({ required: false, example: 'I am excited to apply...' })
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiProperty({ required: false, example: '$140k - $180k' })
  @IsOptional()
  @IsString()
  expectedSalary?: string;

  @ApiProperty({ required: false, example: '2 weeks' })
  @IsOptional()
  @IsString()
  noticePeriod?: string;
}