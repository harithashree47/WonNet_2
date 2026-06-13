import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationLevelDto } from './dto/create-education-level.dto';
import { UpdateEducationLevelDto } from './dto/update-education-level.dto';

@Injectable()
export class EducationLevelService {
  constructor(private prisma: PrismaService) {}

  async create(createEducationLevelDto: CreateEducationLevelDto) {
    try {
      return await this.prisma.educationLevel.create({
        data: {
          name: createEducationLevelDto.name,
          status: createEducationLevelDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Education level name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.educationLevel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.educationLevel.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const educationLevel = await this.prisma.educationLevel.findUnique({
      where: { id },
    });

    if (!educationLevel) {
      throw new NotFoundException(`Education level with ID ${id} not found`);
    }

    return educationLevel;
  }

  async update(id: number, updateEducationLevelDto: UpdateEducationLevelDto) {
    await this.findOne(id);

    try {
      return await this.prisma.educationLevel.update({
        where: { id },
        data: updateEducationLevelDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Education level name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return await this.prisma.educationLevel.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    
    return await this.prisma.educationLevel.delete({
      where: { id },
    });
  }
}