import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill (Admin/Super Admin only)' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  findAll() {
    return this.skillService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active skills' })
  findActive() {
    return this.skillService.findActive();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all skill categories' })
  getCategories() {
    return this.skillService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get skills by category' })
  findByCategory(@Param('category') category: string) {
    return this.skillService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single skill by ID' })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill (Admin/Super Admin only)' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently delete a skill (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
}