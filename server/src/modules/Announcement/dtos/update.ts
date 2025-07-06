import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAnnouncementDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Galaxy Note 10 plus',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Samsung flagman smartfon',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 250,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  price?: number;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Toshkent shahar',
  })
  @IsString()
  location?: string;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 1,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  categoryId?: number;
}
