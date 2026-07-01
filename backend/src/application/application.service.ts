import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { BulkUpdateApplicationDto } from './dto/bulk-update-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

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
      const application = await this.prisma.application.create({
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

      return application;
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
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && userRole !== 'HR') {
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
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && userRole !== 'HR') {
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

  /**
   * Update application status with email notifications
   * Only sends emails for: shortlisted, interview, offered
   */
  async updateStatus(id: number, dto: UpdateStatusDto, companyId: number, userRole: string, hrCompanyId?: number) {
    const { status, interviewDate, interviewTime, interviewMode, interviewLocation } = dto;

    // Get application with job details and user info
    const application = await this.prisma.application.findFirst({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
          }
        },
        user: true,
      }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check permission
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && userRole !== 'HR') {
      throw new ForbiddenException('You do not have permission to update this application');
    }

    // HR can only update applications for jobs in their company
    if (userRole === 'HR') {
      if (!hrCompanyId || application.job.companyId !== hrCompanyId) {
        throw new ForbiddenException('You can only update applications for jobs in your company');
      }
    }

    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    try {
      const updateData: any = { status };

      // If status is interview, also save interview details
      if (status === 'interview') {
        if (interviewDate) updateData.interviewDate = new Date(interviewDate);
        if (interviewTime) updateData.interviewTime = interviewTime;
        if (interviewMode) updateData.interviewMode = interviewMode;
        if (interviewLocation) updateData.interviewLocation = interviewLocation;
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id },
        data: updateData,
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

      // Send email notifications only for shortlisted, interview, offered
      await this.sendStatusEmail(updatedApplication, status);

      return updatedApplication;
    } catch (error) {
      throw new BadRequestException('Failed to update application status');
    }
  }

  /**
   * Send appropriate email based on status — only shortlisted, interview, offered
   */
  private async sendStatusEmail(application: any, status: string) {
    const { user, job } = application;
    const companyName = job.company.name;

    // Skip if user email is not available
    if (!user || !user.email) {
      console.warn('User email not available, skipping email notification');
      return;
    }

    try {
      switch (status) {
        case 'shortlisted':
          await this.emailService.sendShortlistedEmail(
            user.email,
            user.name,
            job.title,
            companyName
          );
          break;

        case 'interview':
          await this.emailService.sendInterviewEmail(
            user.email,
            user.name,
            job.title,
            companyName,
            {
              date: application.interviewDate 
                ? new Date(application.interviewDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'To be confirmed',
              time: application.interviewTime || 'To be confirmed',
              mode: application.interviewMode || 'To be confirmed',
              linkOrAddress: application.interviewLocation || 'Will be shared shortly'
            }
          );
          break;

        case 'offered':
          await this.emailService.sendSelectedEmail(
            user.email,
            user.name,
            job.title,
            companyName,
          );
          break;

        default:
          // No email for statuses (applied, reviewing, rejected, withdrawn)
          break;
      }
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
      // Don't throw error - email failure shouldn't break the application
    }
  }

  async withdraw(id: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: {
        id,
        userId
      },
      include: {
        job: {
          include: {
            company: true
          }
        },
        user: true
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
      const updatedApplication = await this.prisma.application.update({
        where: { id },
        data: { status: 'withdrawn' }
      });

      return updatedApplication;
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

    // Check permissions and get applications with user details
    const applications = await this.prisma.application.findMany({
      where: {
        id: { in: ids },
        job: {
          companyId
        }
      },
      include: {
        job: {
          include: {
            company: true
          }
        },
        user: true,
      }
    });

    if (applications.length !== ids.length) {
      throw new ForbiddenException('You do not have permission to update some applications');
    }

    try {
      const result = await this.prisma.application.updateMany({
        where: {
          id: { in: ids }
        },
        data: { status }
      });

      // Send email notifications for important status changes
      const notifyStatuses = ['shortlisted', 'interview', 'offered'];
      if (notifyStatuses.includes(status)) {
        for (const app of applications) {
          await this.sendStatusEmail(app, status);
        }
      }

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

  async getAllApplications(companyId: number, userRole: string, query: QueryApplicationDto) {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (userRole === 'HR') {
      // HR can only see applications for jobs in their company
      const jobs = await this.prisma.job.findMany({
        where: { companyId },
        select: { id: true }
      });
      const jobIds = jobs.map(job => job.id);
      where.jobId = { in: jobIds };
    }

    if (status) {
      where.status = status;
    }

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
}