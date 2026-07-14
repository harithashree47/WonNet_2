import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ USER REGISTER
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  // ✅ LOGIN (ALL USERS - USER, ADMIN, SUPER_ADMIN)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ✅ ADMIN/SUPER ADMIN LOGIN (UNIFIED FOR SINGLE LOGIN PAGE)
  @Post('admin/login')
  @ApiOperation({ summary: 'Admin/Super Admin login - Single endpoint for both roles' })
  async adminLogin(@Body() body: LoginDto) {
    return this.authService.adminLogin(body.email, body.password);
  }

  // ✅ SUPER_ADMIN ONLY → CREATE ADMIN
  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  createAdmin(@Body() body: CreateUserDto) {
    return this.authService.createAdmin(body);
  }

  // ✅ GET ALL ADMINS
  @Get('admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  getAllAdmins() {
    return this.authService.getAllAdmins();
  }

  // ✅ UPDATE ADMIN (PATCH)
  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateAdmin(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.updateAdmin(+id, body);
  }

  // ✅ SOFT DELETE ADMIN
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  softDeleteAdmin(@Param('id') id: string) {
    return this.authService.softDeleteAdmin(+id);
  }

  // ✅ GET ALL USERS (role === 'USER')
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  // ✅ GET USER PROFILE
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    const userId = req.user.sub;
    return this.authService.getUserProfile(userId);
  }

  // ✅ UPDATE USER STATUS
  @Patch('user/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.authService.updateUserStatus(+id, status);
  }

  // ✅ RESET PASSWORD (SELF OR SUPER_ADMIN FOR ANY USER)
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset password - self or SUPER_ADMIN can reset any user' })
  resetPassword(@Body() body: ResetPasswordDto, @Req() req) {
    return this.authService.resetPassword(
      req.user.sub,
      req.user.role,
      body.newPassword,
      body.email,
    );
  }
}
