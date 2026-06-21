import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { Role } from '@prisma/client';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new HR user
   * Only SUPER_ADMIN can create HR users
   */
  async createHr(data: CreateHrDto, currentUserRole: string) {
    // Check if user has permission (only SUPER_ADMIN)
    if (currentUserRole !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can create HR users');
    }

    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: data.companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Check if mobile already exists
    const existingMobile = await this.prisma.user.findUnique({
      where: { mobile: data.mobile },
    });

    if (existingMobile) {
      throw new BadRequestException('Mobile number already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const hr = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: hashedPassword,
          designation: data.designation || 'HR Manager',
          role: Role.HR,
          companyId: data.companyId,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              logo: true,
            },
          },
        },
      });

      return {
        message: 'HR created successfully',
        user: hr,
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or mobile already exists');
      }
      throw new BadRequestException('Failed to create HR user');
    }
  }

  /**
   * Get all HR users
   */
  async getAllHrs(companyId?: number, userRole?: string) {
    const where: any = {
      role: Role.HR,
    };

    // If not SUPER_ADMIN, only show HR users for their company
    if (userRole !== Role.SUPER_ADMIN && companyId) {
      where.companyId = companyId;
    }

    const hrs = await this.prisma.user.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return hrs;
  }

  /**
   * Get HR by ID
   */
  async getHrById(id: number, companyId?: number, userRole?: string) {
    const where: any = {
      id,
      role: Role.HR,
    };

    // If not SUPER_ADMIN, only allow access to HR users in their company
    if (userRole !== Role.SUPER_ADMIN && companyId) {
      where.companyId = companyId;
    }

    const hr = await this.prisma.user.findFirst({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logo: true,
          },
        },
      },
    });

    if (!hr) {
      throw new NotFoundException('HR user not found');
    }

    return hr;
  }

  /**
   * Update HR user - Can update all fields including status
   */
  async updateHr(id: number, data: UpdateHrDto, companyId?: number, userRole?: string) {
    // Check if HR user exists
    const hr = await this.prisma.user.findFirst({
      where: {
        id,
        role: Role.HR,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        designation: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!hr) {
      throw new NotFoundException('HR user not found');
    }

    // Check permissions
    if (userRole !== Role.SUPER_ADMIN && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only Admin or Super Admin can update HR users');
    }

    // If not SUPER_ADMIN, can only update HR users in their company
    if (userRole !== Role.SUPER_ADMIN && hr.companyId !== companyId) {
      throw new ForbiddenException('You can only update HR users in your company');
    }

    const updateData: any = { ...data };

    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updateData.password;
    }

    // If updating company, verify it exists
    if (data.companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: data.companyId },
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    try {
      const updatedHr = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              logo: true,
            },
          },
        },
      });

      return {
        message: 'HR updated successfully',
        user: updatedHr,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update HR user');
    }
  }

  /**
   * Get HR statistics for dashboard
   */
  async getHrStats(companyId: number) {
    // Get all jobs for the company
    const jobs = await this.prisma.job.findMany({
      where: { companyId },
      select: { id: true },
    });

    const jobIds = jobs.map(job => job.id);

    // Get all HR users count
    const totalHrs = await this.prisma.user.count({
      where: {
        role: Role.HR,
        companyId,
      },
    });

    if (jobIds.length === 0) {
      return {
        totalApplications: 0,
        byStatus: {},
        totalJobs: 0,
        totalHrs,
        recentApplications: [],
      };
    }

    const [totalApplications, byStatus, totalJobs, recentApplications] = await Promise.all([
      this.prisma.application.count({
        where: { jobId: { in: jobIds } },
      }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: { jobId: { in: jobIds } },
        _count: { status: true },
      }),
      this.prisma.job.count({
        where: { companyId },
      }),
      this.prisma.application.findMany({
        where: { jobId: { in: jobIds } },
        include: {
          job: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ]);

    const statusCounts = {};
    byStatus.forEach(item => {
      statusCounts[item.status] = item._count.status;
    });

    return {
      totalApplications,
      byStatus: statusCounts,
      totalJobs,
      totalHrs,
      recentApplications,
    };
  }

  /**
   * Delete HR user (permanent delete - only SUPER_ADMIN)
   */
  async deleteHr(id: number, userRole: string) {
    if (userRole !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can permanently delete HR users');
    }

    const hr = await this.prisma.user.findFirst({
      where: {
        id,
        role: Role.HR,
      },
    });

    if (!hr) {
      throw new NotFoundException('HR user not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'HR user deleted successfully' };
  }
}