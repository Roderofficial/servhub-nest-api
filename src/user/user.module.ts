import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, MailModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
