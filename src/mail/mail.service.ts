import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    return await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.username,
          url,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendCode(user: User, code: string) {
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Twój kod do logowania',
        template: './login-code',
        context: {
          name: user.username,
          code,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
