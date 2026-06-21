import { IsArray, IsIn, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BulkUpdateApplicationDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];

  @ApiProperty({ 
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    example: 'shortlisted'
  })
  @IsIn(['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
  @IsString()
  status: string;
}