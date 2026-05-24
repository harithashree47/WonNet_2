import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ USER REGISTER
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  // ✅ LOGIN (ALL)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ✅ SUPER_ADMIN ONLY → CREATE ADMIN
  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  createAdmin(@Body() body: CreateUserDto) {
    return this.authService.createAdmin(body);
  }


}