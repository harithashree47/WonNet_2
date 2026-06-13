import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new location (Admin/Super Admin only)' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  findAll() {
    return this.locationService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active locations' })
  findActive() {
    return this.locationService.findActive();
  }

  @Get('states')
  @ApiOperation({ summary: 'Get distinct states' })
  getStates() {
    return this.locationService.getDistinctStates();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get distinct cities by state' })
  @ApiQuery({ name: 'state', required: false })
  getCities(@Query('state') state?: string) {
    return this.locationService.getDistinctCities(state);
  }

  @Get('by-state/:state')
  @ApiOperation({ summary: 'Get locations by state' })
  findByState(@Param('state') state: string) {
    return this.locationService.findByState(state);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single location by ID' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a location (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a location (set status to inactive)' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete a location (Super Admin only)' })
  delete(@Param('id') id: string) {
    return this.locationService.delete(+id);
  }
}