import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable() // This decorator marks the class as a provider that can be injected into other classes in the NestJS application.
export class MailService {
  private transporter: nodemailer.Transporter; // This property will hold the nodemailer transporter instance, which is used to send emails.
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_ID'), // Retrieves the email user from environment variables using ConfigService.
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // Retrieves the email password from environment variables using ConfigService.
      },
    });
  }

  async sendEmail(options: nodemailer.SendMailOptions) {
    try {
      await this.transporter.sendMail(options); // Uses the transporter to send an email with the provided options.
    } catch (error) {
      console.error('Error sending email:', error); // Logs any errors that occur during the email sending process.
    }
  }
}
