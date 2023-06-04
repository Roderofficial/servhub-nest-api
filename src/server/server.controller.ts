import {
  Controller,
  Get,
  Param,
  Response,
  Body,
  Post,
  forwardRef,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './server.entity';
import { ServerService } from './server.service';
import { ServerStatusService } from 'src/server-status/server-status.service';
import { GameService } from 'src/game/game.service';
import { ServerListDto } from './dto/server-list.dto';
import { TakeOwnershipDto } from './dto/take-ownership.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('server')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,
    @Inject(forwardRef(() => ServerStatusService))
    private readonly serverStatusService: ServerStatusService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  @Get()
  async findAll(@Response() res: any): Promise<Server[]> {
    const servers = await this.serverService.findAll();
    return res.status(200).json(servers);
  }

  @Post('/list')
  async list(@Response() res: any, @Body() serverListDto: ServerListDto) {
    const server = await this.serverService.serverList(serverListDto);
    return res.status(200).json(server);
  }

  @UseGuards(AuthGuard)
  @Post('/take-ownership')
  async takeOwnership(
    @Body() takeOwnershipDto: TakeOwnershipDto,
    @Response() res: any,
    @Req() req: any,
  ) {
    return await this.serverService.takeServerOwnership(
      parseInt(takeOwnershipDto.serverId),
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/ownership-server-name/:id')
  async getToOwnershipServerNameRequired(
    @Req() req: any,
    @Param('id') id: string,
    @Response() res: any,
  ) {
    const name = await this.serverService.getServerOwnershipNameGenerate(
      parseInt(id),
      req.user.id,
    );

    return res.status(200).json({
      name,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Response() res: any,
  ): Promise<Server> {
    const server = await this.serverService.findOne(parseInt(id));
    return res.status(200).json(server);
  }

  @Post('/create')
  async create(
    @Body() createServerDto: CreateServerDto,
    @Response() res: any,
  ): Promise<Server | any> {
    console.log(createServerDto);
    try {
      const server = await this.serverService.create(createServerDto);
      const status = await this.serverStatusService.pushNewStatus(server.id);
      return res.status(200).json({
        server,
      });
    } catch (e) {
      if (e === 'NOT_AVAILABLE') {
        return res.status(400).json({
          message: 'Server not available',
          err_code: 'NOT_AVAILABLE',
        });
      }
      if (e === 'GAME_NOT_FOUND') {
        return res.status(400).json({
          message: 'Game not found',
          err_code: 'GAME_NOT_FOUND',
        });
      }

      if (e === 'SERVER_ALREADY_EXISTS') {
        return res.status(400).json({
          message: 'Server already exists',
          err_code: 'SERVER_ALREADY_EXISTS',
        });
      }

      console.log(e);
      return res.status(400).json({
        message: 'Error',
      });
    }
  }
}
