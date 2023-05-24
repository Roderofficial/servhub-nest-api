import {
  Controller,
  Get,
  Param,
  Response,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { ServerStatusService } from './server-status.service';

@Controller('server-status')
export class ServerStatusController {
  constructor(private readonly serverStatusService: ServerStatusService) {}

  @Get()
  async findAll(
    @Response() res,
    @Query('game') game: string,
    @Query('ip') ip: string,
    @Query('port') port: string,
  ) {
    console.log('game', game, 'ip', ip, 'port', port, 'params');
    const serverStatus = await this.serverStatusService.getRealStatus(
      ip,
      +port,
      game,
    );
    console.log('serverStatus', serverStatus, 'statu');
    return res.status(200).json(serverStatus);
  }
}
