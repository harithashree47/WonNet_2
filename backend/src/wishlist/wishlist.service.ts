import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(userId: number, jobId: number) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if job exists and is published
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'published') {
      throw new BadRequestException('Cannot add a non-published job to wishlist');
    }

    // Check if already in wishlist (unique constraint will also catch this)
    const existing = await this.prisma.wishlist.findFirst({
      where: { userId, jobId },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Job is already in your wishlist');
    }

    // Add to wishlist
    return this.prisma.wishlist.create({
      data: {
        user: { connect: { id: userId } },
        job: { connect: { id: jobId } },
      },
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
                skill: true,
              },
            },
            benefits: {
              include: {
                benefit: true,
              },
            },
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: number, jobId: number) {
    // Check if exists and belongs to user
    const wishlistItem = await this.prisma.wishlist.findFirst({
      where: { userId, jobId },
      select: { id: true },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    return this.prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });
  }

  async getUserWishlist(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.wishlist.findMany({
        where: { userId },
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
                  skill: true,
                },
              },
              benefits: {
                include: {
                  benefit: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlist.count({ where: { userId } }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async isWishlisted(userId: number, jobId: number) {
    const item = await this.prisma.wishlist.findFirst({
      where: { userId, jobId },
      select: { id: true },
    });

    return {
      wishlisted: !!item,
    };
  }
}