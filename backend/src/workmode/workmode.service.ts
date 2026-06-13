import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkmodeDto } from './dto/create-workmode.dto';
import { UpdateWorkmodeDto } from './dto/update-workmode.dto';

@Injectable()
export class WorkmodeService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkmodeDto: CreateWorkmodeDto) {
    try {
      return await this.prisma.workMode.create({
        data: {
          name: createWorkmodeDto.name,
          status: createWorkmodeDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Work mode name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.workMode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.workMode.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const workMode = await this.prisma.workMode.findUnique({
      where: { id },
    });

    if (!workMode) {
      throw new NotFoundException(`Work mode with ID ${id} not found`);
    }

    return workMode;
  }

  async update(id: number, updateWorkmodeDto: UpdateWorkmodeDto) {
    await this.findOne(id); // Check if exists

    try {
      return await this.prisma.workMode.update({
        where: { id },
        data: updateWorkmodeDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Work mode name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    
    // Soft delete - set status to inactive
    return await this.prisma.workMode.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id); // Check if exists
    
    // Permanent delete
    return await this.prisma.workMode.delete({
      where: { id },
    });
  }
}