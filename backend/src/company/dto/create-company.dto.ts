import { IsString, IsOptional, IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo?: string;  

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}