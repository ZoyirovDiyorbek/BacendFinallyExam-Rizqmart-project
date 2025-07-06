import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { LikedService } from './liked.service';
import { GetOneLikedDto } from './dtos';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { EnableRoles, Protected } from 'src/guards/decorators';
import { Roles } from '@prisma/client';

@ApiCookieAuth()
@Controller('liked')
export class LikedController {
  constructor(private readonly service: LikedService) {}

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Get all liked announcements',
  })
  @Get('/all')
  async getAll(@Req() req: Request & { userId: number }) {
    return await this.service.getAll(req.userId);
  }

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Get one liked announcement',
  })
  @Get()
  async getOne(@Query() payload: GetOneLikedDto) {
    return await this.service.getOne(payload);
  }

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Create new liked announcement',
  })
  @Post()
  async create(
    @Body('announcementId', ParseIntPipe) announcementId: number,
    @Req() req: Request & { userId: number },
  ) {
    return await this.service.create(req.userId, announcementId);
  }

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Delete one liked announcement',
  })
  @Delete()
  async delete(
    @Body('announcementId', ParseIntPipe) announcementId: number,
    @Req() req: Request & { userId: number },
  ) {
    return await this.service.delete(req.userId, announcementId);
  }
}
