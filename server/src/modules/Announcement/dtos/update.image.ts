import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  @IsOptional()
  images: Express.Multer.File[];
}
