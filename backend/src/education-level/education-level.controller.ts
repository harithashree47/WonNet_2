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
import { EducationLevelService } from './education-level.service';
import { CreateEducationLevelDto } from './dto/create-education-level.dto';
import { UpdateEducationLevelDto } from './dto/update-education-level.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Education Level')
@Controller('education-level')
export class EducationLevelController {
  constructor(private readonly educationLevelService: EducationLevelService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new education level (Admin/Super Admin only)' })
  create(@Body() createEducationLevelDto: CreateEducationLevelDto) {
    return this.educationLevelService.create(createEducationLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all education levels' })
  findAll() {
    return this.educationLevelService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active education levels' })
  findActive() {
    return this.educationLevelService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single education level by ID' })
  findOne(@Param('id') id: string) {
    return this.educationLevelService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an education level (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateEducationLevelDto: UpdateEducationLevelDto) {
    return this.educationLevelService.update(+id, updateEducationLevelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete an education level (set status to inactive)' })
  remove(@Param('id') id: string) {
    return this.educationLevelService.remove(+id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete an education level (Super Admin only)' })
  delete(@Param('id') id: string) {
    return this.educationLevelService.delete(+id);
  }
}