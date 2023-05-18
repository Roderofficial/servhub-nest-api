import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ServerModule } from './server/server.module';

@Module({
  imports: [UserModule, GameModule, ServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
