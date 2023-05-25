import {
  Controller,
  Get,
  Param,
  Response,
  Body,
  Post,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './server.entity';
import { ServerService } from './server.service';
import { ServerStatusService } from 'src/server-status/server-status.service';
import { GameService } from 'src/game/game.service';

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
  async findAll(@Response() res) {
    const servers = this.serverService.findAll();
    return res.status(200).json(servers);
  }

  @Post('/create')
  async create(
    @Body() createServerDto: CreateServerDto,
    @Response() res: any,
  ): Promise<Server | any> {
    this.serverService.create(createServerDto);
  }
}
