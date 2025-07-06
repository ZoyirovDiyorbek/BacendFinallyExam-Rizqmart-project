import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'john@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'john123',
  })
  @IsString()
  @MinLength(4)
  password: string;
}
