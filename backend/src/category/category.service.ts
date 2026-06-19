import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
  try {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        status: data.status || 'active', // ADD THIS LINE
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException('Category name already exists');
    }
    throw error;
  }
}
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.category.findMany({
      where: { status: 'active' },
      include: {
        _count: { select: { jobs: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update category');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: { status: 'inactive' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to restrict category');
    }
  }
}