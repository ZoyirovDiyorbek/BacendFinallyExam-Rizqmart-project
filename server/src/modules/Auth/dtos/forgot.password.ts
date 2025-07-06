import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'johngmail@gmail.com',
  })
  @IsEmail()
  email: string;
}
