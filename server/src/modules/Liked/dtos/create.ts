import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikedDto {
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 1,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  announcementId: number;
}
