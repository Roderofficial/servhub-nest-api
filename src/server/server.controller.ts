import { Controller, Get, Param, Response, Body, Post } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './server.entity';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
  findAll(): string {
    return 'This action returns all servers';
  }
}
