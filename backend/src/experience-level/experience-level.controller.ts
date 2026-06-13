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
import { ExperienceLevelService } from './experience-level.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Experience Level')
@Controller('experience-level')
export class ExperienceLevelController {
  constructor(private readonly experienceLevelService: ExperienceLevelService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new experience level (Admin/Super Admin only)' })
  create(@Body() createExperienceLevelDto: CreateExperienceLevelDto) {
    return this.experienceLevelService.create(createExperienceLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all experience levels' })
  findAll() {
    return this.experienceLevelService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active experience levels' })
  findActive() {
    return this.experienceLevelService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single experience level by ID' })
  findOne(@Param('id') id: string) {
    return this.experienceLevelService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an experience level (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateExperienceLevelDto: UpdateExperienceLevelDto) {
    return this.experienceLevelService.update(+id, updateExperienceLevelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete an experience level (set status to inactive)' })
  remove(@Param('id') id: string) {
    return this.experienceLevelService.remove(+id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete an experience level (Super Admin only)' })
  delete(@Param('id') id: string) {
    return this.experienceLevelService.delete(+id);
  }
}