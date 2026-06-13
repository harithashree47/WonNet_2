import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobtypeService } from './jobtype.service';
import { CreateJobtypeDto } from './dto/create-jobtype.dto';
import { UpdateJobtypeDto } from './dto/update-jobtype.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Job Type')
@Controller('jobtype')
export class JobtypeController {
  constructor(private readonly jobtypeService: JobtypeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job type' })
  create(@Body() createJobtypeDto: CreateJobtypeDto) {
    return this.jobtypeService.create(createJobtypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job types' })
  findAll() {
    return this.jobtypeService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active job types' })
  findActive() {
    return this.jobtypeService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single job type by ID' })
  findOne(@Param('id') id: string) {
    return this.jobtypeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job type' })
  update(@Param('id') id: string, @Body() updateJobtypeDto: UpdateJobtypeDto) {
    return this.jobtypeService.update(+id, updateJobtypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job type (Soft delete - sets status to inactive)' })
  remove(@Param('id') id: string) {
    return this.jobtypeService.remove(+id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete a job type (Super Admin only)' })
  delete(@Param('id') id: string) {
    return this.jobtypeService.delete(+id);
  }
}