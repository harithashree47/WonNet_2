import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ✅ USER REGISTER ONLY
  async register(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: hashedPassword,
          designation: data.designation,
          role: 'USER',
        },
      });

      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          designation: user.designation,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or mobile already exists');
      }
      throw error;
    }
  }

  // ✅ LOGIN (ALL ROLES)
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        designation: user.designation,
        role: user.role,
      },
    };
  }

  // ✅ SUPER_ADMIN → CREATE ADMIN (WITH DESIGNATION)
  async createAdmin(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const admin = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: hashedPassword,
          designation: data.designation,
          role: 'ADMIN',
        },
      });

      return {
        message: 'Admin created successfully',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          mobile: admin.mobile,
          designation: admin.designation,
          role: admin.role,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or mobile already exists');
      }
      throw error;
    }
  }

  // ✅ ADMIN/SUPER ADMIN LOGIN (SINGLE ENDPOINT FOR BOTH)
  async adminLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has admin role (ADMIN or SUPER_ADMIN)
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Access denied. Admin or Super Admin privileges required.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: `Login successful as ${user.role}`,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        designation: user.designation,
        role: user.role,
      },
    };
  }
}