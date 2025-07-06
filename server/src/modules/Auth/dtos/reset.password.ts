import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'johngmail@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'john123',
  })
  @IsString()
  @Length(4)
  newPassword: string;
}
