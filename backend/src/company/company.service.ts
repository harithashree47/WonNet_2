import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          location: data.location,
          status: data.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Company name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }
    return company;
  }

  async update(id: number, data: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update company');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: { status: 'inactive' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to remove company');
    }
  }
}