import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { BulkUpdateApplicationDto } from './dto/bulk-update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Req() req) {
    // Use the authenticated user's ID from JWT sub if not provided in DTO
    if (!createApplicationDto.userId) {
      createApplicationDto.userId = req.user.sub;
    }
    return this.applicationService.create(createApplicationDto);
  }

  @Get('user/my-applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s applications' })
  getUserApplications(@Query() query: QueryApplicationDto, @Req() req) {
    return this.applicationService.getUserApplications(req.user.sub, query);
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s application statistics' })
  getUserStats(@Req() req) {
    return this.applicationService.getUserApplicationStats(req.user.sub);
  }

  @Get('company/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'HR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company\'s application statistics' })
  getCompanyStats(@Req() req) {
    const companyId = req.user.companyId;
    if (!companyId) {
      return { total: 0, statuses: {}, byJob: [] };
    }
    return this.applicationService.getCompanyApplicationStats(companyId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'HR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications (Admin/HR only)' })
  findAll(@Query() query: QueryApplicationDto, @Req() req) {
    const companyId = req.user.companyId || null;
    return this.applicationService.getAllApplications(companyId, req.user.role, query);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications for a specific job' })
  getJobApplications(
    @Param('jobId') jobId: string,
    @Query() query: QueryApplicationDto,
    @Req() req
  ) {
    return this.applicationService.getJobApplications(
      +jobId, 
      req.user.companyId, 
      query
    );
  }

  @Get('check/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user has applied to a job' })
  checkApplication(@Param('jobId') jobId: string, @Req() req) {
    return this.applicationService.hasUserApplied(+jobId, req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.applicationService.findOne(+id, req.user.sub, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application details' })
  update(
    @Param('id') id: string, 
    @Body() updateApplicationDto: UpdateApplicationDto, 
    @Req() req
  ) {
    // Only allow users to update their own applications (unless admin)
    return this.applicationService.update(
      +id, 
      updateApplicationDto, 
      req.user.sub, 
      req.user.role
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'HR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req
  ) {
    const hrCompanyId = req.user.role === 'HR' ? req.user.companyId : undefined;
    return this.applicationService.updateStatus(
      +id, 
      updateStatusDto, 
      req.user.companyId, 
      req.user.role,
      hrCompanyId
    );
  }

  @Patch(':id/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw an application' })
  withdraw(@Param('id') id: string, @Req() req) {
    return this.applicationService.withdraw(+id, req.user.sub);
  }

  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update application status' })
  bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateApplicationDto, @Req() req) {
    return this.applicationService.bulkUpdateStatus(
      bulkUpdateDto,
      req.user.companyId,
      req.user.role
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an application (Admin only)' })
  remove(@Param('id') id: string, @Req() req) {
    return this.applicationService.remove(+id, req.user.role);
  }
}