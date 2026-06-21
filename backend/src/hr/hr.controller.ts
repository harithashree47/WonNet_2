import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('HR Management')
@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HrController {
  constructor(private readonly hrService: HrService) {}

  /**
   * Create a new HR user (Super Admin only)
   */
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new HR user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'HR created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only Super Admin can create HR' })
  create(@Body() createHrDto: CreateHrDto, @Req() req) {
    return this.hrService.createHr(createHrDto, req.user.role);
  }

  /**
   * Get all HR users
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get all HR users' })
  @ApiResponse({ status: 200, description: 'HR users retrieved successfully' })
  findAll(@Req() req) {
    const companyId = req.user.companyId;
    const userRole = req.user.role;
    return this.hrService.getAllHrs(companyId, userRole);
  }

  /**
   * Get HR user by ID
   */
  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get HR user by ID' })
  @ApiResponse({ status: 200, description: 'HR user retrieved successfully' })
  @ApiResponse({ status: 404, description: 'HR user not found' })
  findOne(@Param('id') id: string, @Req() req) {
    const companyId = req.user.companyId;
    const userRole = req.user.role;
    return this.hrService.getHrById(+id, companyId, userRole);
  }

  /**
   * Update HR user - Can update all fields including status
   */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update HR user (including status)' })
  @ApiResponse({ status: 200, description: 'HR updated successfully' })
  @ApiResponse({ status: 404, description: 'HR user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateHrDto: UpdateHrDto,
    @Req() req
  ) {
    const companyId = req.user.companyId;
    const userRole = req.user.role;
    return this.hrService.updateHr(+id, updateHrDto, companyId, userRole);
  }

  /**
   * Get HR dashboard statistics
   */
  @Get('stats/dashboard')
  @Roles(Role.HR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get HR dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  getDashboardStats(@Req() req) {
    const companyId = req.user.companyId;
    return this.hrService.getHrStats(companyId);
  }

  /**
   * Delete HR user (permanent - Super Admin only)
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete HR user permanently (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'HR deleted successfully' })
  @ApiResponse({ status: 404, description: 'HR user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only Super Admin can delete HR' })
  remove(@Param('id') id: string, @Req() req) {
    return this.hrService.deleteHr(+id, req.user.role);
  }
}