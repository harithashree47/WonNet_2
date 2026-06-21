import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';
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
}