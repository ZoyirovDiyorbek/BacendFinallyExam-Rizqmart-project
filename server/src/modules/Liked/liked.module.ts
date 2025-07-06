import { Module } from '@nestjs/common';
import { LikedService } from './liked.service';
import { PrismaService } from '../Prisma';
import { LikedController } from './liked.controller';

@Module({
  controllers: [LikedController],
  providers: [LikedService, PrismaService],
})
export class LikedModule {}
