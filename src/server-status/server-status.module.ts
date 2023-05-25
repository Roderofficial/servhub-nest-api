import { Module } from '@nestjs/common';
import { ServerStatusProviders } from './server-status.provider';
import { ServerStatusService } from './server-status.service';
import { HttpModule } from '@nestjs/axios';
import { ServerStatusController } from './server-status.controller';
import { ServerModule } from 'src/server/server.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [HttpModule, forwardRef(() => ServerModule)],
  controllers: [ServerStatusController],
  providers: [ServerStatusService, ...ServerStatusProviders],
  exports: [ServerStatusService],
})
export class ServerStatusModule {}
