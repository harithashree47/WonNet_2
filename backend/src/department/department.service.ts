import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.prisma.department.create({
        data: {
          name: createDepartmentDto.name,
          status: createDepartmentDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Department name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.department.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.department.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id);

    try {
      return await this.prisma.department.update({
        where: { id },
        data: updateDepartmentDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Department name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return await this.prisma.department.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    
    return await this.prisma.department.delete({
      where: { id },
    });
  }
}