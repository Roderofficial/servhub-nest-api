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
    const serverStatus = await this.serverStatusService.isServerAvailable(
      ip,
      +port,
      game,
    );
    console.log('serverStatus', serverStatus, 'statu');
    return res.status(200).json(serverStatus);
  }

  @Get('/push-new-status/:server_id')
  async pushNewStatus(
    @Param('server_id') server_id: number,
    @Response() res,
  ): Promise<any> {
    try {
      const status = await this.serverStatusService.pushNewStatus(server_id);
      return res.status(200).json({
        message: 'Status updated',
        status,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: 'Server not found',
        err_code: 'SERVER_NOT_FOUND',
      });
    }
  }

  @Post('/get-server-status')
  async getServerStatus(@Body() body: any, @Response() res): Promise<any> {
    try {
      const serverStatus = await this.serverStatusService.getRealStatus(
        body.ip,
        body.port,
        body.game,
      );
      return res.status(200).json(serverStatus);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: 'Server not found',
        err_code: 'SERVER_NOT_FOUND',
      });
    }
  }
}
