import { Controller, Get, Req } from '@nestjs/common';
import { LastSeenService } from './last.seen.service';
import { EnableRoles, Protected } from 'src/guards/decorators';
import { Roles } from '@prisma/client';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth()
@Controller('last-seen')
export class LastSeenController {
  constructor(private readonly service: LastSeenService) {}

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @Get()
  async getAllLastSeenAnnouncement(@Req() req: Request & { userId: number }) {
    return await this.service.getLastSeen(req.userId);
  }
}
