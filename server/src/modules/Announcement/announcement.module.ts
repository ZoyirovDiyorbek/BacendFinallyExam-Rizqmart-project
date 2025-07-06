import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { PrismaService } from '../Prisma';
import { FsHelper } from 'src/helpers';
import { LastSeenController } from './last.seen.controller';
import { LastSeenService } from './last.seen.service';

@Module({
  controllers: [AnnouncementController, LastSeenController],
  providers: [AnnouncementService, LastSeenService, PrismaService, FsHelper],
})
export class AnnouncementModle {}
