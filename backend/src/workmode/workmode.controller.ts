import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkmodeService } from './workmode.service';
import { CreateWorkmodeDto } from './dto/create-workmode.dto';
import { UpdateWorkmodeDto } from './dto/update-workmode.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Work Mode')
@Controller('workmode')
export class WorkmodeController {
  constructor(private readonly workmodeService: WorkmodeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new work mode (Admin/Super Admin only)' })
  create(@Body() createWorkmodeDto: CreateWorkmodeDto) {
    return this.workmodeService.create(createWorkmodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work modes' })
  findAll() {
    return this.workmodeService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active work modes' })
  findActive() {
    return this.workmodeService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single work mode by ID' })
  findOne(@Param('id') id: string) {
    return this.workmodeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a work mode (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateWorkmodeDto: UpdateWorkmodeDto) {
    return this.workmodeService.update(+id, updateWorkmodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a work mode (set status to inactive)' })
  remove(@Param('id') id: string) {
    return this.workmodeService.remove(+id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete a work mode (Super Admin only)' })
  delete(@Param('id') id: string) {
    return this.workmodeService.delete(+id);
  }
}