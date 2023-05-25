import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { serverProviders } from './server.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ServerStatusModule } from 'src/server-status/server-status.module';
import { forwardRef } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ServerStatusModule),
    forwardRef(() => GameModule),
  ],
  controllers: [ServerController],
  providers: [ServerService, ...serverProviders],
  exports: [ServerService],
})
export class ServerModule {}
