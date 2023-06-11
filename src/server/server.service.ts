import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { ServerStatusService } from 'src/server-status/server-status.service';
import { GameService } from 'src/game/game.service';
import { ConfigService } from '@nestjs/config';
import { ServerListDto } from './dto/server-list.dto';
import { UserService } from 'src/user/user.service';
import { ServerStatus } from 'src/server-status/server-status.entity';

@Injectable()
export class ServerService {
  constructor(
    @Inject('SERVER_REPOSITORY') private serverRepository: typeof Server,
    private readonly serverStatusService: ServerStatusService,
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Server[]> {
    return this.serverRepository.findAll<Server>({
      include: [
        Game,
        {
          model: ServerStatus,
          limit: 1,
          order: [['id', 'DESC']],
          required: false,
          foreignKey: 'serverId',
        },
      ],
    });
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
      include: [
        Game,
        { model: ServerStatus, limit: 1, order: [['id', 'DESC']] },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'verificatied'],
          required: false,
        },
      ],
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
      throw 'SERVICE_NOT_AVAILABLE';
    }

    if (serverStatus.response_status == 0) {
      throw 'NOT_AVAILABLE';
    }

    const server_country_code =
      await this.serverStatusService.fetchServerCountryCode(
        await this.getRealAdressIp(createServerDto.ip),
      );

    console.log(server_country_code, 'server_country_code');

    const server = new Server();
    server.name = serverStatus.name;
    server.ip = createServerDto.ip;
    server.port = +createServerDto.port;
    server.gameId = +createServerDto.gameID;
    server.online = true;
    server.extras = serverStatus.extra;
    server.country_code = server_country_code;
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

  async serverList(serverListDto: ServerListDto): Promise<any> {
    const servers = await this.serverRepository.findAndCountAll({
      where: {
        gameId: serverListDto.gameId,
        online: true,
      },
      include: [
        Game,
        { model: ServerStatus, limit: 1, order: [['id', 'DESC']] },
      ],
      order: [['id', 'DESC']],
      limit: 20,
      offset:
        (parseInt(serverListDto.page) - 1) *
        this.configService.get('PAGE_SIZE'),
    });
    return {
      ...servers,
      page: parseInt(serverListDto.page),
      pageSize: parseInt(this.configService.get('PAGE_SIZE')),
    };
  }

  async takeServerOwnership(serverId: number, userId: number): Promise<any> {
    const server = await this.serverRepository.findOne<Server>({
      where: {
        id: serverId,
      },
      include: [Game],
    });

    if (!server) {
      throw new NotFoundException('SERVER_NOT_FOUND');
    }

    if (server.ownerId) {
      throw new ForbiddenException('SERVER_ALREADY_OWNED');
    }

    //check if user exists
    const user = await this.userService.findOne(userId);

    //get real server status
    const serverStatus = await this.serverStatusService.getRealStatus(
      server.ip,
      server.port,
      server.game.name,
    );

    if (!serverStatus) {
      console.log(serverStatus);
      throw new ForbiddenException('SERVICE_NOT_AVAILABLE');
    }

    if (
      serverStatus.name !=
      `${this.configService.get(
        'TAKE_SERVER_OWNERSHIP_PREFIX',
      )}${serverId}-${userId}`
    ) {
      throw new ForbiddenException('WRONG_SERVER_NAME');
    }

    return await server.update({ ownerId: userId });
  }

  async getServerOwnershipNameGenerate(serverId: number, userId: number) {
    return `${this.configService.get(
      'TAKE_SERVER_OWNERSHIP_PREFIX',
    )}${serverId}-${userId}`;
  }

  async delete(id: number): Promise<void> {
    await this.serverRepository.destroy({
      where: {
        id,
      },
    });
  }
}
