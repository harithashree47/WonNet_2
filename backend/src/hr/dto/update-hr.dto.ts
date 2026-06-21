import { PartialType } from '@nestjs/mapped-types';
import { CreateHrDto } from './create-hr.dto';
import { IsOptional, IsString, IsIn, IsEmail, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHrDto extends PartialType(CreateHrDto) {
  @ApiProperty({ required: false, example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'hr@newcompany.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '9876543210' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ required: false, example: 'HR Director' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ required: false, example: 'newPassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ required: false, enum: ['active', 'inactive'], example: 'inactive' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  @IsString()
  status?: string;
}