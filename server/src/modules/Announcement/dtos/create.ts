import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAnnouncementDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Galaxy Note 10 plus',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Samsung flagman smartfon',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 250,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  price: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Toshkent shahar',
  })
  @IsString()
  location: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 1,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  @IsOptional()
  images: Express.Multer.File[];
}
