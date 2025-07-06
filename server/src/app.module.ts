import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AnnouncementModle,
  AuthModule,
  CategoryModule,
  LikedModule,
  PrismaModule,
} from './modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CheckAuth, CheckRole } from './guards';
import { MailModule } from './utils';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisCustomModule } from './clients';
import { HttpExceptionFilter } from './filters';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/api/uploads',
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    CategoryModule,
    AnnouncementModle,
    LikedModule,
    MailModule,
    RedisCustomModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuth,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRole,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
