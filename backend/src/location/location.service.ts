import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      return await this.prisma.location.create({
        data: {
          state: createLocationDto.state,
          city: createLocationDto.city,
          status: createLocationDto.status || 'active',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Location with this state and city already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.location.findMany({
      orderBy: [{ state: 'asc' }, { city: 'asc' }],
    });
  }

  async findActive() {
    return await this.prisma.location.findMany({
      where: { status: 'active' },
      orderBy: [{ state: 'asc' }, { city: 'asc' }],
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async findByState(state: string) {
    return await this.prisma.location.findMany({
      where: { state, status: 'active' },
      orderBy: { city: 'asc' },
    });
  }

  async getDistinctStates() {
    const locations = await this.prisma.location.findMany({
      where: { status: 'active' },
      distinct: ['state'],
      select: { state: true },
      orderBy: { state: 'asc' },
    });
    return locations.map(l => l.state);
  }

  async getDistinctCities(state?: string) {
    const where: any = { status: 'active' };
    if (state) where.state = state;
    
    const locations = await this.prisma.location.findMany({
      where,
      distinct: ['city'],
      select: { city: true, state: true },
      orderBy: { city: 'asc' },
    });
    return locations.map(l => ({ city: l.city, state: l.state }));
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id);

    try {
      return await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Location with this state and city already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return await this.prisma.location.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    
    return await this.prisma.location.delete({
      where: { id },
    });
  }
}