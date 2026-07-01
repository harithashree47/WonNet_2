import { IsIn, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ 
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    example: 'interview'
  })
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  @IsString()
  status: string;

  @ApiProperty({ required: false, example: '2024-06-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @ApiProperty({ required: false, example: '10:00 AM' })
  @IsOptional()
  @IsString()
  interviewTime?: string;

  @ApiProperty({ required: false, example: 'Online' })
  @IsOptional()
  @IsString()
  interviewMode?: string;

  @ApiProperty({ required: false, example: 'https://meet.google.com/abc-defg-hij' })
  @IsOptional()
  @IsString()
  interviewLocation?: string;
}