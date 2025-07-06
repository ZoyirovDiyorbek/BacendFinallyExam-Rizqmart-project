import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../Prisma';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos';
import * as bcrypt from 'bcryptjs';
import { Roles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { FsHelper } from 'src/helpers';
import { MailService } from 'src/utils';
import { RedisService } from 'src/clients';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly fs: FsHelper,
    private readonly mail: MailService,
    private readonly redis: RedisService,
  ) {}

  async onModuleInit() {
    try {
      await this.#_seedUsers();
      await this.fs.ensureUploadDirExists();
      console.log('✅');
    } catch (error) {
      console.log(error.message);
      console.log('❌');
    }
  }
  async register(payload: RegisterDto) {
    const founded = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (founded) {
      throw new BadRequestException('User with this email already exists!');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Roles.USER,
      },
    });

    const accesToken = await this.jwt.signAsync({
      id: user.id,
      role: user.role,
    });
    const refreshToken = await this.jwt.signAsync({
      id: user.id,
      role: user.role,
    });

    await this.mail.sendMail({
      subject: 'Register',
      to: user.email,
      text: 'You are successfully  registered our site',
    });
    return {
      message: 'success',
      data: {
        user,
        token: {
          accesToken,
          refreshToken,
        },
      },
    };
  }
  async login(payload: LoginDto) {
    const founded = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!founded) {
      throw new ConflictException('Incorrect email or password!');
    }

    const isMatchPassword = await bcrypt.compare(
      payload.password,
      founded.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Incorrect email or password!');
    }

    const accesToken = await this.jwt.signAsync({
      id: founded.id,
      role: founded.role,
    });
    const refreshToken = await this.jwt.signAsync({
      id: founded.id,
      role: founded.role,
    });

    return {
      message: 'success',
      data: {
        founded,
        token: {
          accesToken,
          refreshToken,
        },
      },
    };
  }
  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const data = await this.redis.setVlue(`${payload.email}`, otp, 60 * 3);

    await this.mail.sendMail({
      to: payload.email,
      subject: 'Your OTP code',
      text: `Your OTP code is: ${otp}`,
    });

    return {
      message: 'OTP sended to you email',
    };
  }
  async resetPassword(payload: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = await this.redis.getvalue(payload.email);

    if (!otp) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (otp !== payload.otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      message: 'success',
    };
  }
  async #_seedUsers() {
    const user = {
      name: 'Dilmuhammad',
      email: 'dilmuhammadabdumalikov06@gmail.com',
      password: '20060524',
      role: Roles.ADMIN,
    };

    const founded = await this.prisma.user.findFirst({
      where: { email: user.email },
    });

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!founded) {
      await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          password: hashedPassword,
        },
      });
    }
  }
  async google(email: string) {
    const founded = await this.prisma.user.findFirst({ where: { email } });

    if (!founded) {
      throw new NotFoundException('Incorrect email');
    }
    const accesToken = await this.jwt.signAsync({
      id: founded.id,
      role: founded.role,
    });
    const refreshToken = await this.jwt.signAsync({
      id: founded.id,
      role: founded.role,
    });
    return {
      message: 'success',
      data: {
        founded,
        token: {
          accesToken,
          refreshToken,
        },
      },
    };
  }
  async profile(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return {
      message: 'success',
      data: user,
    };
  }

}
