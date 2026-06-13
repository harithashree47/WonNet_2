import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkmodeDto } from './create-workmode.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateWorkmodeDto extends PartialType(CreateWorkmodeDto) {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}