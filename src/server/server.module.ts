import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { serverProviders } from './server.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ServerController],
  providers: [ServerService, ...serverProviders],
})
export class ServerModule {}
