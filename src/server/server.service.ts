import { Inject, Injectable } from '@nestjs/common';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { Game } from 'src/game/game.entity';
import { ServerStatusService } from 'src/server-status/server-status.service';
import { GameService } from 'src/game/game.service';

@Injectable()
export class ServerService {
  constructor(
    @Inject('SERVER_REPOSITORY') private serverRepository: typeof Server,
    private readonly serverStatusService: ServerStatusService,
    private readonly gameService: GameService,
  ) {}

  async findAll(): Promise<Server[]> {
    return this.serverRepository.findAll<Server>();
  }

  async findByGameId(gameId: number): Promise<Server[]> {
    return this.serverRepository.findAll<Server>({
      where: {
        gameId,
      },
    });
  }

  async findOne(id: number): Promise<Server> {
    return this.serverRepository.findOne<Server>({
      where: {
        id,
      },
      include: [Game],
    });
  }

  async create(createServerDto: CreateServerDto): Promise<Server> {
    //get the game name by id

    const game = await this.gameService.findOne(+createServerDto.gameID);
    // get server status
    const serverStatus = await this.serverStatusService.getRealStatus(
      createServerDto.ip,
      +createServerDto.port,
      game.name,
    );

    if (!serverStatus) {
      throw new Error('NOT_AVAILABLE');
    }

    const server = new Server();
    server.name = serverStatus.name;
    server.ip = createServerDto.ip;
    server.port = +createServerDto.port;
    server.gameId = +createServerDto.gameID;
    server.online = true;
    server.extras = serverStatus.extra;
    console.log(serverStatus, server);
    console.log(server.dataValues);
    try {
      await server.save();
    } catch (e) {
      console.log(e);
    }
    return server;
  }

  async update(server_id: number, server: Server): Promise<[number, Server[]]> {
    return this.serverRepository.update(server, {
      where: {
        id: server_id,
      },
    });
  }
}
