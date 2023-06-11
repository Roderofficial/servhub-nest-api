import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendCode(user: User, code: string) {
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Twój kod do logowania do aplikacji',
        template: './login-code',
        context: {
          name: user.username,
          code,
          appname: this.configService.get('APP_NAME'),
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
