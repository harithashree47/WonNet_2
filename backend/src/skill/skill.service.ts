import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    try {
      return await this.prisma.skill.create({
        data: {
          name: createSkillDto.name,
          category: createSkillDto.category || 'general',
          status: createSkillDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Skill name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.skill.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.skill.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  // ✅ ADD THIS METHOD - Get all skill categories
  async getCategories() {
    const skills = await this.prisma.skill.findMany({
      where: { status: 'active' },
      distinct: ['category'],
      select: { category: true },
    });
    return skills.map(s => s.category).filter(Boolean);
  }

  // ✅ ADD THIS METHOD - Find skills by category
  async findByCategory(category: string) {
    return await this.prisma.skill.findMany({
      where: { category, status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id);
    try {
      return await this.prisma.skill.update({
        where: { id },
        data: updateSkillDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Skill name already exists');
      }
      throw error;
    }
  }

  // HARD DELETE - Permanently remove from database
  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.skill.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete skill');
    }
  }
}