import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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
          status: user.status,
        },
      };
    } catch (error: any) {
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
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        password: true,
        designation: true,
        role: true,
        status: true,
        companyId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ Block inactive users from logging in
    if (user.status === 'inactive') {
      throw new UnauthorizedException('acess denied call supeadmin to give acess');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      companyId: user.companyId,
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
        status: user.status,
        companyId: user.companyId,
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
          status: admin.status,
        },
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or mobile already exists');
      }
      throw error;
    }
  }

  // ✅ UPDATE ADMIN
  async updateAdmin(id: number, data: UpdateUserDto) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updateData.password;
    }

    try {
      const admin = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return {
        message: 'Admin updated successfully',
        user: admin,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update admin');
    }
  }

  // ✅ SOFT DELETE (INACTIVE)
  async softDeleteAdmin(id: number) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { status: 'inactive' },
      });
      return { message: 'Admin account restricted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to restrict admin');
    }
  }

  // ✅ GET ALL ADMINS
  async getAllAdmins() {
    return this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
      },
    });
  }

  // ✅ GET ALL USERS (role === 'USER')
  async getAllUsers() {
    return this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ✅ UPDATE USER STATUS
  async updateUserStatus(id: number, status: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ✅ ADMIN/SUPER ADMIN/HR LOGIN (SINGLE ENDPOINT FOR ALL STAFF)
  async adminLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        password: true,
        designation: true,
        role: true,
        status: true,
        companyId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has admin or HR role
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'HR'];
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedException('Access denied. Staff privileges required.');
    }

    // ✅ Block inactive admins from logging in
    if (user.status === 'inactive') {
      throw new UnauthorizedException('acess denied call supeadmin to give acess');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      companyId: user.companyId,
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
        status: user.status,
        companyId: user.companyId,
      },
    };
  }
}