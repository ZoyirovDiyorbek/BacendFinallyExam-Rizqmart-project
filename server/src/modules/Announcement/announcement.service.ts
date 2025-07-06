import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../Prisma';
import { FsHelper } from 'src/helpers';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dtos';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { LastSeenService } from './last.seen.service';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fs: FsHelper,
    private readonly seen: LastSeenService,
  ) {}

  async getAll(categoryID?: number, location?: string) {
    const announcements = await this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        ...(location && { location }),
        ...(categoryID && { categoryID }),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return {
      message: 'success',
      data: announcements,
    };
  }

  async getOne(id: number, userId: number) {
    const founded = await this.prisma.announcement.findFirst({ where: { id } });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }
    await this.seen.createLastSeeenAnnoucement(userId, id);

    return {
      message: 'success',
      data: founded,
    };
  }

  async create(
    payload: CreateAnnouncementDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const image = await this.fs.uploadFile(files);
    const announcement = await this.prisma.announcement.create({
      data: {
        name: payload.name,
        categoryID: payload.categoryId,
        description: payload.description,
        location: payload.location,
        price: payload.price,
        images: image.fileUrl,
        userId: userId,
      },
    });

    return {
      message: 'success',
      data: announcement,
    };
  }

  async delete(id: number) {
    const founded = await this.prisma.announcement.findFirst({ where: { id } });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }
    if (founded.images) {
      for (let file of founded.images) {
        if (fs.existsSync(path.join(process.cwd(), 'uploads', file))) {
          this.fs.unlinkFile(file);
        }
      }
    }

    await this.prisma.announcement.delete({ where: { id } });

    return {
      message: 'success',
    };
  }

  async update(payload: UpdateAnnouncementDto, id: number) {
    const founded = await this.prisma.announcement.findFirst({ where: { id } });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }

    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: {
        name: payload.name,
        price: payload.price,
        categoryID: payload.categoryId,
        description: payload.description,
        location: payload.location,
      },
    });

    return {
      message: 'success',
      data: announcement,
    };
  }

  async updateImage(files: Express.Multer.File[], id: number) {
    const founded = await this.prisma.announcement.findFirst({ where: { id } });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }

    if (founded.images) {
      for (let file of founded.images) {
        if (fs.existsSync(path.join(process.cwd(), 'uploads', file))) {
          this.fs.unlinkFile(file);
        }
      }
    }

    const image = await this.fs.uploadFile(files);

    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: { images: image.fileUrl },
    });

    return {
      message: 'success',
      data: announcement,
    };
  }

  async getByName(name: string) {
    const announcements = await this.prisma.announcement.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return announcements;
  }

  async me(id: number) {
    const announcements = await this.prisma.announcement.findMany({
      where: { userId: id },
      orderBy: {
        categoryID: 'desc',
      },
    });

    return {
      message: 'success',
      data: announcements,
    };
  }
}
