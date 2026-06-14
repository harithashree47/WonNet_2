import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBenefitDto {
  @ApiProperty({ example: 'Health Insurance' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: '🏥' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}