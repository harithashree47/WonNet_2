import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobtypeDto } from './dto/create-jobtype.dto';
import { UpdateJobtypeDto } from './dto/update-jobtype.dto';

@Injectable()
export class JobtypeService {
  constructor(private prisma: PrismaService) {}

  async create(createJobtypeDto: CreateJobtypeDto) {
    try {
      return await this.prisma.jobType.create({
        data: {
          name: createJobtypeDto.name,
          status: createJobtypeDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Job type name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.jobType.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.jobType.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const jobType = await this.prisma.jobType.findUnique({
      where: { id },
    });

    if (!jobType) {
      throw new NotFoundException(`Job type with ID ${id} not found`);
    }

    return jobType;
  }

  async update(id: number, updateJobtypeDto: UpdateJobtypeDto) {
    await this.findOne(id); // Check if exists

    try {
      return await this.prisma.jobType.update({
        where: { id },
        data: updateJobtypeDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Job type name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    
    // Soft delete - set status to inactive
    return await this.prisma.jobType.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id); // Check if exists
    
    // Permanent delete
    return await this.prisma.jobType.delete({
      where: { id },
    });
  }
}