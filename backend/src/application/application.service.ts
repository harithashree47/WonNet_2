import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { BulkUpdateApplicationDto } from './dto/bulk-update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateApplicationDto) {
    // Check if job exists and is active
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      include: { company: true }
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'published') {
      throw new BadRequestException('This job is not accepting applications');
    }

    // Check if user already applied
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        userId: data.userId
      }
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    // Check if job deadline has passed
    if (job.applyDeadline && new Date(job.applyDeadline) < new Date()) {
      throw new BadRequestException('Application deadline has passed');
    }

    try {
      return await this.prisma.application.create({
        data: {
          job: { connect: { id: data.jobId } },
          user: { connect: { id: data.userId } },
          resumeUrl: data.resumeUrl,
          linkedin: data.linkedin,
          portfolio: data.portfolio,
          motivation: data.motivation,
          expectedSalary: data.expectedSalary,
          noticePeriod: data.noticePeriod,
          status: data.status || 'applied',
        },
        include: {
          job: {
            include: {
              company: true,
              location: true,
              jobType: true,
              workMode: true,
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true,
              designation: true,
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already applied for this job');
      }
      throw error;
    }
  }

  async getUserApplications(userId: number, query: QueryApplicationDto) {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status })
    };

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          job: {
            include: {
              company: true,
              location: true,
              jobType: true,
              workMode: true,
              experienceLevel: true,
              category: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.application.count({ where })
    ]);

    return {
      data: applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getJobApplications(jobId: number, companyId: number, query: QueryApplicationDto) {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Verify job belongs to company
    const job = await this.prisma.job.findFirst({
      where: {
        id: jobId,
        companyId
      }
    });

    if (!job) {
      throw new NotFoundException('Job not found or you do not have access');
    }

    const where = {
      jobId,
      ...(status && { status })
    };

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true,
              designation: true,
            }
          },
          job: {
            include: {
              company: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.application.count({ where })
    ]);

    return {
      data: applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number, userId: number, userRole: string) {
    const where: any = { id };

    // If user is not admin, only allow access to their own applications
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      where.userId = userId;
    }

    const application = await this.prisma.application.findFirst({
      where,
      include: {
        job: {
          include: {
            company: true,
            location: true,
            jobType: true,
            workMode: true,
            experienceLevel: true,
            educationLevel: true,
            category: true,
            skills: {
              include: {
                skill: true
              }
            },
            benefits: {
              include: {
                benefit: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            designation: true,
          }
        }
      }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }


  async update(id: number, data: UpdateApplicationDto, userId: number, userRole: string) {
  // Check if application exists
  const application = await this.prisma.application.findFirst({
    where: { id },
    include: { job: true }
  });

  if (!application) {
    throw new NotFoundException('Application not found');
  }

  // If user is not admin, only allow updating their own applications
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    if (application.userId !== userId) {
      throw new ForbiddenException('You can only update your own applications');
    }
  }

  // Don't allow updating if application is already offered or rejected
  if (application.status === 'offered') {
    throw new BadRequestException('Cannot update an application with an offer');
  }

  if (application.status === 'rejected') {
    throw new BadRequestException('Cannot update a rejected application');
  }

  // Remove jobId and userId from update data if present (they shouldn't be updated)
  const { jobId, userId: _, ...updateData } = data;

  try {
    return await this.prisma.application.update({
      where: { id },
      data: {
        resumeUrl: updateData.resumeUrl,
        linkedin: updateData.linkedin,
        portfolio: updateData.portfolio,
        motivation: updateData.motivation,
        expectedSalary: updateData.expectedSalary,
        noticePeriod: updateData.noticePeriod,
        status: updateData.status,
      },
      include: {
        job: {
          include: {
            company: true,
            location: true,
            jobType: true,
            workMode: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            designation: true,
          }
        }
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException('Application already exists');
    }
    throw new BadRequestException('Failed to update application');
  }
}

  async updateStatus(id: number, status: string, companyId: number, userRole: string) {
    // Get application with job details
    const application = await this.prisma.application.findFirst({
      where: { id },
      include: {
        job: true
      }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check permission
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Check if user owns the company
      const company = await this.prisma.company.findFirst({
        where: {
          id: application.job.companyId,
        }
      });

      if (!company) {
        throw new ForbiddenException('You do not have permission to update this application');
      }
    }

    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    try {
      return await this.prisma.application.update({
        where: { id },
        data: { status },
        include: {
          job: {
            include: {
              company: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true,
            }
          }
        }
      });
    } catch (error) {
      throw new BadRequestException('Failed to update application status');
    }
  }

  async withdraw(id: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status === 'offered') {
      throw new BadRequestException('Cannot withdraw an application with an offer');
    }

    if (application.status === 'rejected') {
      throw new BadRequestException('Application already rejected');
    }

    try {
      return await this.prisma.application.update({
        where: { id },
        data: { status: 'withdrawn' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to withdraw application');
    }
  }

  async getUserApplicationStats(userId: number) {
    const [total, byStatus] = await Promise.all([
      this.prisma.application.count({
        where: { userId }
      }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: { userId },
        _count: {
          status: true
        }
      })
    ]);

    const statusCounts = {};
    byStatus.forEach(item => {
      statusCounts[item.status] = item._count.status;
    });

    return {
      total,
      statuses: statusCounts
    };
  }

  async getCompanyApplicationStats(companyId: number) {
    // Get all jobs for company
    const jobs = await this.prisma.job.findMany({
      where: { companyId },
      select: { id: true }
    });

    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return {
        total: 0,
        statuses: {},
        byJob: []
      };
    }

    const [total, byStatus, byJob] = await Promise.all([
      this.prisma.application.count({
        where: {
          jobId: { in: jobIds }
        }
      }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: {
          jobId: { in: jobIds }
        },
        _count: {
          status: true
        }
      }),
      this.prisma.job.findMany({
        where: { companyId },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              applications: true
            }
          }
        }
      })
    ]);

    const statusCounts = {};
    byStatus.forEach(item => {
      statusCounts[item.status] = item._count.status;
    });

    return {
      total,
      statuses: statusCounts,
      byJob: byJob.map(job => ({
        id: job.id,
        title: job.title,
        applications: job._count.applications
      }))
    };
  }

  async hasUserApplied(jobId: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: {
        jobId,
        userId
      }
    });

    return { hasApplied: !!application };
  }

  async bulkUpdateStatus(data: BulkUpdateApplicationDto, companyId: number, userRole: string) {
    const { ids, status } = data;

    // Validate status
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Check if company owns all applications
      const applications = await this.prisma.application.findMany({
        where: {
          id: { in: ids },
          job: {
            companyId
          }
        },
        include: {
          job: true
        }
      });

      if (applications.length !== ids.length) {
        throw new ForbiddenException('You do not have permission to update some applications');
      }
    }

    try {
      const result = await this.prisma.application.updateMany({
        where: {
          id: { in: ids }
        },
        data: { status }
      });

      return {
        count: result.count,
        message: `${result.count} applications updated successfully`
      };
    } catch (error) {
      throw new BadRequestException('Failed to update applications');
    }
  }

  async remove(id: number, userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only admins can delete applications');
    }

    const application = await this.prisma.application.findUnique({
      where: { id }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    try {
      return await this.prisma.application.delete({
        where: { id }
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete application');
    }
  }
}