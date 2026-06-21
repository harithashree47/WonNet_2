import { IsString, IsOptional, IsInt, IsIn, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  jobId: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ required: false, example: 'https://example.com/resume.pdf' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @IsString()
  resumeUrl?: string;

  @ApiProperty({ required: false, example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @IsString()
  linkedin?: string;

  @ApiProperty({ required: false, example: 'https://portfolio.com' })
  @IsOptional()
  @IsUrl({ require_tld: false })
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

  @ApiProperty({ required: false, default: 'applied' })
  @IsOptional()
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  @IsString()
  status?: string;
}