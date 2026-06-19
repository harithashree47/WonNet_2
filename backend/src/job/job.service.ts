import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    const {
      skillIds = [],
      benefitIds = [],
      applyDeadline,
      ...jobData
    } = createJobDto;

    try {
      // Validate salary range
      if (jobData.salaryMin && jobData.salaryMax && jobData.salaryMin > jobData.salaryMax) {
        throw new BadRequestException('Minimum salary cannot be greater than maximum salary');
      }

      // Convert applyDeadline to ISO-8601 DateTime if provided
      let deadlineISO = null;
      if (applyDeadline) {
        deadlineISO = new Date(applyDeadline).toISOString();
        if (isNaN(new Date(deadlineISO).getTime())) {
          throw new BadRequestException('Invalid date format for applyDeadline');
        }
      }

      return await this.prisma.$transaction(async (tx) => {
        // Create the job
        const job = await tx.job.create({
          data: {
            ...jobData,
            vacancies: jobData.vacancies || 1,
            currency: jobData.currency || 'INR',
            status: jobData.status || 'draft',
            applyDeadline: deadlineISO,
          },
          include: {
            company: true,
            category: true,
            jobType: true,
            workMode: true,
            experienceLevel: true,
            educationLevel: true,
            location: true,
            department: true,
          },
        });

        // Add skills if provided
        if (skillIds.length > 0) {
          await tx.jobSkill.createMany({
            data: skillIds.map(skillId => ({
              jobId: job.id,
              skillId,
            })),
            skipDuplicates: true,
          });
        }

        // Add benefits if provided
        if (benefitIds.length > 0) {
          await tx.jobBenefit.createMany({
            data: benefitIds.map(benefitId => ({
              jobId: job.id,
              benefitId,
            })),
            skipDuplicates: true,
          });
        }

        // Return job with all relations
        return await tx.job.findUnique({
          where: { id: job.id },
          include: {
            company: true,
            category: true,
            jobType: true,
            workMode: true,
            experienceLevel: true,
            educationLevel: true,
            location: true,
            department: true,
            skills: {
              include: { skill: true },
            },
            benefits: {
              include: { benefit: true },
            },
          },
        });
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid reference ID provided');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.job.findMany({
      include: {
        company: true,
        category: true,
        jobType: true,
        workMode: true,
        experienceLevel: true,
        educationLevel: true,
        location: true,
        department: true,
        skills: {
          include: { skill: true },
        },
        benefits: {
          include: { benefit: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return await this.prisma.job.findMany({
      where: { status: 'published' },
      include: {
        company: true,
        category: true,
        jobType: true,
        workMode: true,
        experienceLevel: true,
        location: true,
        department: true,
        skills: {
          include: { skill: true },
        },
        benefits: {
          include: { benefit: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        jobType: true,
        workMode: true,
        experienceLevel: true,
        educationLevel: true,
        location: true,
        department: true,
        skills: {
          include: { skill: true },
        },
        benefits: {
          include: { benefit: true },
        },
        applications: {
          include: {
            user: {
              select: { id: true, name: true, email: true, mobile: true },
            },
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    await this.findOne(id);

    const {
      skillIds,
      benefitIds,
      applyDeadline,
      ...jobData
    } = updateJobDto;

    // Validate salary range
    if (jobData.salaryMin && jobData.salaryMax && jobData.salaryMin > jobData.salaryMax) {
      throw new BadRequestException('Minimum salary cannot be greater than maximum salary');
    }

    // Convert applyDeadline to ISO-8601 DateTime if provided
    let deadlineISO = null;
    if (applyDeadline) {
      deadlineISO = new Date(applyDeadline).toISOString();
      if (isNaN(new Date(deadlineISO).getTime())) {
        throw new BadRequestException('Invalid date format for applyDeadline');
      }
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update job
        const job = await tx.job.update({
          where: { id },
          data: {
            ...jobData,
            applyDeadline: deadlineISO,
          },
        });

        // Update skills if provided
        if (skillIds !== undefined) {
          await tx.jobSkill.deleteMany({ where: { jobId: id } });
          if (skillIds.length > 0) {
            await tx.jobSkill.createMany({
              data: skillIds.map(skillId => ({
                jobId: id,
                skillId,
              })),
              skipDuplicates: true,
            });
          }
        }

        // Update benefits if provided
        if (benefitIds !== undefined) {
          await tx.jobBenefit.deleteMany({ where: { jobId: id } });
          if (benefitIds.length > 0) {
            await tx.jobBenefit.createMany({
              data: benefitIds.map(benefitId => ({
                jobId: id,
                benefitId,
              })),
              skipDuplicates: true,
            });
          }
        }

        return await tx.job.findUnique({
          where: { id },
          include: {
            company: true,
            category: true,
            jobType: true,
            workMode: true,
            experienceLevel: true,
            educationLevel: true,
            location: true,
            department: true,
            skills: {
              include: { skill: true },
            },
            benefits: {
              include: { benefit: true },
            },
          },
        });
      });
    } catch (error) {
      throw new BadRequestException('Failed to update job');
    }
  }

  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    return await this.prisma.job.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Delete related records first to avoid foreign key constraint violations
    await this.prisma.jobSkill.deleteMany({ where: { jobId: id } });
    await this.prisma.jobBenefit.deleteMany({ where: { jobId: id } });
    await this.prisma.application.deleteMany({ where: { jobId: id } });
    return await this.prisma.job.delete({
      where: { id },
    });
  }

  async findByCompany(companyId: number) {
    return await this.prisma.job.findMany({
      where: { companyId },
      include: {
        category: true,
        jobType: true,
        location: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategory(categoryId: number) {
    return await this.prisma.job.findMany({
      where: { categoryId, status: 'published' },
      include: {
        company: true,
        jobType: true,
        location: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLocation(locationId: number) {
    return await this.prisma.job.findMany({
      where: { locationId, status: 'published' },
      include: {
        company: true,
        category: true,
        jobType: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchJobs(query: string) {
    return await this.prisma.job.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { company: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        company: true,
        category: true,
        jobType: true,
        location: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}