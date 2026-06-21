import { IsString, IsEmail, IsInt, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHrDto {
  @ApiProperty({ example: 'Jane HR Manager' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'hr@techcorp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  mobile: string;

  @ApiProperty({ example: 'Senior HR Manager' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  companyId: number;
}