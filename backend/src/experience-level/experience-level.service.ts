import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';

@Injectable()
export class ExperienceLevelService {
  constructor(private prisma: PrismaService) {}

  async create(createExperienceLevelDto: CreateExperienceLevelDto) {
    // Validate minYears <= maxYears
    if (createExperienceLevelDto.minYears > createExperienceLevelDto.maxYears) {
      throw new BadRequestException('minYears cannot be greater than maxYears');
    }

    try {
      return await this.prisma.experienceLevel.create({
        data: {
          label: createExperienceLevelDto.label,
          minYears: createExperienceLevelDto.minYears,
          maxYears: createExperienceLevelDto.maxYears,
          status: createExperienceLevelDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Experience level label already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.experienceLevel.findMany({
      orderBy: { minYears: 'asc' },
    });
  }

  async findActive() {
    return await this.prisma.experienceLevel.findMany({
      where: { status: 'active' },
      orderBy: { minYears: 'asc' },
    });
  }

  async findOne(id: number) {
    const experienceLevel = await this.prisma.experienceLevel.findUnique({
      where: { id },
    });

    if (!experienceLevel) {
      throw new NotFoundException(`Experience level with ID ${id} not found`);
    }

    return experienceLevel;
  }

  async update(id: number, updateExperienceLevelDto: UpdateExperienceLevelDto) {
    await this.findOne(id); // Check if exists

    // Validate minYears <= maxYears if both are provided
    if (updateExperienceLevelDto.minYears !== undefined && 
        updateExperienceLevelDto.maxYears !== undefined &&
        updateExperienceLevelDto.minYears > updateExperienceLevelDto.maxYears) {
      throw new BadRequestException('minYears cannot be greater than maxYears');
    }

    try {
      return await this.prisma.experienceLevel.update({
        where: { id },
        data: updateExperienceLevelDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Experience level label already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    
    // Soft delete - set status to inactive
    return await this.prisma.experienceLevel.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id); // Check if exists
    
    // Permanent delete
    return await this.prisma.experienceLevel.delete({
      where: { id },
    });
  }
}