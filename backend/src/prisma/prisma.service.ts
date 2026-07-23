// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    
    
    if (process.env.NODE_ENV === 'production') {
      const url = process.env.DATABASE_URL;
      if (url && !url.includes('pgbouncer=true')) {
        const separator = url.includes('?') ? '&' : '?';
        process.env.DATABASE_URL = `${url}${separator}pgbouncer=true`;
      }
    }

    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}