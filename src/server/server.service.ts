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

  async findByIpPort(ip: string, port: number): Promise<Server> {
    return this.serverRepository.findOne<Server>({
      where: {
        ip,
        port,
      },
    });
  }

  async create(createServerDto: CreateServerDto): Promise<Server> {
    //get the game name by id

    const game = await this.gameService.findOne(+createServerDto.gameID);
    if (!game) {
      throw 'GAME_NOT_FOUND';
    }

    //check if server already exists
    const serverExists = await this.findByIpPort(
      await this.getRealAdressIp(createServerDto.ip),
      +createServerDto.port,
    );

    if (serverExists) {
      throw 'SERVER_ALREADY_EXISTS';
    }

    // get server status
    const serverStatus = await this.serverStatusService.getRealStatus(
      createServerDto.ip,
      +createServerDto.port,
      game.name,
    );

    if (!serverStatus) {
      throw 'NOT_AVAILABLE';
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

  async update(id: number, data: any): Promise<Server> {
    const server = await this.serverRepository.findOne<Server>({
      where: {
        id,
      },
    });
    return server.update(data);
  }

  async getRealAdressIp(ip: string): Promise<string> {
    //check if ip is a domain
    if (ip.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)) {
      const dns = require('dns');
      return new Promise((resolve, reject) => {
        dns.lookup(ip, (err, address, family) => {
          if (err) reject(err);
          resolve(address);
        });
      });
    } else {
      return ip;
    }
  }

  async updateOnlineStatus(id: number, online: boolean): Promise<Server> {
    const server = await this.serverRepository.findOne<Server>({
      where: {
        id,
      },
    });
    return server.update({ online });
  }
}
