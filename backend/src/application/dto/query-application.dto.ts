import { IsOptional, IsInt, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryApplicationDto {
  @ApiProperty({ required: false, enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'] })
  @IsOptional()
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  status?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}