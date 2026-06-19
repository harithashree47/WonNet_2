import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Job')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job (Admin/Super Admin only)' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  findAll() {
    return this.jobService.findAll();
  }

  @Get('published')
  @ApiOperation({ summary: 'Get only published jobs' })
  findPublished() {
    return this.jobService.findPublished();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search jobs' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  searchJobs(@Query('q') query: string) {
    return this.jobService.searchJobs(query);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get jobs by company' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.jobService.findByCompany(+companyId);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get jobs by category' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.jobService.findByCategory(+categoryId);
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'Get jobs by location' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.jobService.findByLocation(+locationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single job by ID' })
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.jobService.updateStatus(+id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }
}