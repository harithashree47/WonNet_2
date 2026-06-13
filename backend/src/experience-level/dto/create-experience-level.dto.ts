import { IsNotEmpty, IsString, IsInt, IsOptional, IsIn, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceLevelDto {
  @ApiProperty({ example: '1-3 Years' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  minYears: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  maxYears: number;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}