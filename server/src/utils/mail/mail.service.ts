import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      const mail = await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
      });
      return mail.messageId;
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw new InternalServerErrorException('Error whie sending mail');
    }
  }
}
