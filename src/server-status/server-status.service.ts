import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ServerStatus } from './server-status.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { HttpServerStatus } from './httpStatus.interface';
import { ServerService } from '../server/server.service';
import { forwardRef } from '@nestjs/common';

import e from 'express';

@Injectable()
export class ServerStatusService {
  constructor(
    @Inject('SERVER_STATUS_REPOSITORY')
    private serverStatusRepository: typeof ServerStatus,
    private httpService: HttpService,

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

  async isServerAvailable(
    ip: string,
    port: number,
    game: string,
  ): Promise<any> {
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
    const url = `http://127.0.0.1:8000/status`;
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
}
