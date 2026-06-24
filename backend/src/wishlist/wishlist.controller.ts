import { Controller, Get, Post, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('jobs/:jobId')
  async addToWishlist(@Req() req, @Param('jobId') jobId: string) {
    const userId = req.user.sub;
    return this.wishlistService.addToWishlist(userId, Number(jobId));
  }

  @Delete('jobs/:jobId')
  async removeFromWishlist(@Req() req, @Param('jobId') jobId: string) {
    const userId = req.user.sub;
    return this.wishlistService.removeFromWishlist(userId, Number(jobId));
  }

  @Get('jobs/:jobId/status')
  async isWishlisted(@Req() req, @Param('jobId') jobId: string) {
    const userId = req.user.sub;
    return this.wishlistService.isWishlisted(userId, Number(jobId));
  }

  @Get()
  async getMyWishlist(@Req() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    const userId = req.user.sub;
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.wishlistService.getUserWishlist(userId, pageNum, limitNum);
  }
}