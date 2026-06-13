import { IsString, IsOptional, IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'contact@techcorp.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '+1 234 567 8900' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'https://techcorp.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}