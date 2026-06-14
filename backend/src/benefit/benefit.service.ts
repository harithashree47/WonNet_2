import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Injectable()
export class BenefitService {
  constructor(private prisma: PrismaService) {}

  async create(createBenefitDto: CreateBenefitDto) {
    try {
      return await this.prisma.benefit.create({
        data: {
          name: createBenefitDto.name,
          icon: createBenefitDto.icon,
          status: createBenefitDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Benefit name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.benefit.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return await this.prisma.benefit.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const benefit = await this.prisma.benefit.findUnique({
      where: { id },
    });
    if (!benefit) {
      throw new NotFoundException(`Benefit with ID ${id} not found`);
    }
    return benefit;
  }

  async update(id: number, updateBenefitDto: UpdateBenefitDto) {
    await this.findOne(id);
    try {
      return await this.prisma.benefit.update({
        where: { id },
        data: updateBenefitDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Benefit name already exists');
      }
      throw error;
    }
  }

  // HARD DELETE - Permanently remove from database
  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.benefit.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete benefit');
    }
  }
}