import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma';

@Injectable()
export class LastSeenService {
  constructor(private readonly prisma: PrismaService) {}

  async createLastSeeenAnnoucement(userId: number, announcementId: number) {
    return await this.prisma.lastSeen.upsert({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        userId: userId,
        announcementId: announcementId,
      },
    });
  }

  async getLastSeen(userId: number) {
    const seen = await this.prisma.lastSeen.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        announsement: {
          include:{
            user: {
              select:{
                email: true
              }
            }
          }

        },
      },
    });

    return {
      message: 'success',
      data: seen,
    };
  }
}
