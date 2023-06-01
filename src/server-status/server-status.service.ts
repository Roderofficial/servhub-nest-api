import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ServerStatus } from './server-status.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { HttpServerStatus } from './httpStatus.interface';
import { ServerService } from '../server/server.service';
import { forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import e from 'express';

@Injectable()
export class ServerStatusService {
  constructor(
    @Inject('SERVER_STATUS_REPOSITORY')
    private serverStatusRepository: typeof ServerStatus,
    private httpService: HttpService,
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,

    @Inject(forwardRef(() => ServerService))
    private serverService: ServerService,
  ) {}

  async findAll(): Promise<ServerStatus[]> {
    return this.serverStatusRepository.findAll<ServerStatus>();
  }

  async findOne(id: number): Promise<ServerStatus> {
    return this.serverStatusRepository.findOne<ServerStatus>({
      where: {
        id,
      },
    });
  }

  async create(): Promise<ServerStatus> {
    const serverStatus = new ServerStatus();

    return serverStatus.save();
  }

  /**
   * Check if server is available
   * @param ip  server ip
   * @param port server port
   * @param game server game
   * @returns true if server is available, false if not
   */
  async isServerAvailable(
    ip: string,
    port: number,
    game: string,
  ): Promise<boolean> {
    try {
      const serverStatus = await this.getRealStatus(ip, port, game);
      if (serverStatus.response_status == 0) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  async pushNewStatus(server_id: number) {
    const server = await this.serverService.findOne(server_id);

    if (!server) {
      throw 'SERVER_NOT_FOUND';
    }

    const realStatus = await this.getRealStatus(
      server.ip,
      server.port,
      server.game.name,
    );

    console.log(realStatus);

    const serverStatus = new ServerStatus();

    if (realStatus.response_status == 0) {
      serverStatus.serverId = server_id;
      serverStatus.online = false;
      serverStatus.players = 0;
      serverStatus.maxPlayers = 0;
      serverStatus.extras = null;
    } else {
      serverStatus.serverId = server_id;
      serverStatus.online = true;
      serverStatus.players = realStatus.players;
      serverStatus.maxPlayers = realStatus.max_players;
      serverStatus.extras = realStatus.extra;
    }

    await serverStatus.save();

    //update server
    server.extras = serverStatus.extras;
    server.online = serverStatus.online;
    if (serverStatus.online) {
      server.name = realStatus.name;
    }

    await server.save();

    return serverStatus;
  }

  /**
   * Get server status from microservice
   * @param ip String server ip
   * @param port Number server port
   * @param game String name of the game
   * @returns information about server from microservice
   */
  async getRealStatus(
    ip: string,
    port: number,
    game: string,
  ): Promise<HttpServerStatus> {
    const serverStatus = this.fetchServerStatus(ip, port, game);
    return serverStatus;
  }

  /**
   * Fetch server status from microservice
   * @param ip  server ip
   * @param port server port
   * @param game  server game
   * @returns server status
   */
  private async fetchServerStatus(
    ip: string,
    port: number,
    game: string,
  ): Promise<any> {
    const url = `${this.configService.get(
      'SERVER_STATUS_MICROSERVICE_URL',
    )}/status`;
    const serverStatus = await lastValueFrom(
      this.httpService.get<HttpServerStatus>(url, {
        params: { ip, port, game },
      }),
    ).then((res) => {
      return res.data;
    });
    console.log('serverStatusB', serverStatus);
    return serverStatus;
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'updateAllServersStatus',
    timeZone: 'Europe/Warsaw',
  })
  async updateAllServersStatus() {
    const servers = await this.serverService.findAll();

    for (const server of servers) {
      console.log('update server', server.id, 'time', new Date());
      await this.pushNewStatus(server.id);
    }
  }
}
