import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
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
}