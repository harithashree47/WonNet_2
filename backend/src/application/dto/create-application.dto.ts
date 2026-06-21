import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';
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
  @IsString()
  resumeUrl?: string;

  @ApiProperty({ required: false, default: 'applied' })
  @IsOptional()
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  @IsString()
  status?: string;
}
