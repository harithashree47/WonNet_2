import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}