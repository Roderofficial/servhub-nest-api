import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { serverProviders } from './server.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ServerStatusModule } from 'src/server-status/server-status.module';
import { forwardRef } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MailModule,
    DatabaseModule,
    AuthModule,
    forwardRef(() => ServerStatusModule),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ServerController],
  providers: [ServerService, ...serverProviders],
  exports: [ServerService],
})
export class ServerModule {}
