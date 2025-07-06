import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../Prisma';
import { GetOneLikedDto } from './dtos';

@Injectable()
export class LikedService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(id: number) {
    const likedAnnouncements = await this.prisma.liked.findMany({
      where: { userId: id },
      include: {
        announsement: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'success',
      data: likedAnnouncements,
    };
  }

  async getOne(payload: GetOneLikedDto) {
    const founded = await this.prisma.liked.findFirst({
      where: { announcementId: payload.announcementId, userId: payload.userId },
      include: { announsement: true },
    });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }

    return {
      message: 'success',
      data: founded,
    };
  }

  async create(userId: number, announcementId: number) {
    const founded = await this.prisma.liked.findFirst({
      where: { announcementId: announcementId, userId: userId },
    });
    if (founded) {
      throw new ConflictException('You already like this announcement');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const announcement = await this.prisma.announcement.findFirst({
      where: { id: announcementId },
    });

    if (!user) {
      throw new BadRequestException('You are not registered');
    }
    if (!announcement) {
      throw new NotFoundException('Annoucement not found!');
    }

    const liked = await this.prisma.liked.create({
      data: { announcementId: announcementId, userId: userId },
    });
    return {
      message: 'success',
      data: liked,
    };
  }

  async delete(userId: number, announcementId: number) {
    const founded = await this.prisma.liked.findFirst({
      where: { userId: userId, announcementId: announcementId },
    });

    if (!founded) {
      throw new NotFoundException('Announcement not found!');
    }
    await this.prisma.liked.delete({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
    });

    return {
      message: 'success',
    };
  }
}
