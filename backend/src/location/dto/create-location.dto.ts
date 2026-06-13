import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'California' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'San Francisco' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}