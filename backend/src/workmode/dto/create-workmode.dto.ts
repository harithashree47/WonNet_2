import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkmodeDto {
  @ApiProperty({ example: 'Remote' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}