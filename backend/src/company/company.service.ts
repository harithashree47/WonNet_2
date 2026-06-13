import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
          locationId: data.locationId,
          status: data.status || 'active',
        },
        include: {
          location: true, // Include location details in response
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
      include: {
        location: true, // Include location details
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: number, data: UpdateCompanyDto) {
    await this.findOne(id);
    try {
      return await this.prisma.company.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          locationId: data.locationId,
          status: data.status,
        },
        include: {
          location: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update company');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.company.update({
        where: { id },
        data: { status: 'inactive' },
        include: {
          location: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to remove company');
    }
  }
}