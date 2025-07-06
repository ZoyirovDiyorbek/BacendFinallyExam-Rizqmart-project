import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Smartfonlar',
  })
  @IsString()
  name: string;
}
