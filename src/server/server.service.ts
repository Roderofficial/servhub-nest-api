import { Inject, Injectable } from '@nestjs/common';
import { Server, ServerStatus } from './server.entity';
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class ServerService {
  constructor(
    @Inject('SERVER_REPOSITORY') private serverRepository: typeof Server,
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
    });
  }

  async create(createServerDto: CreateServerDto): Promise<Server> {
    const server = new Server();

    return server.save();
  }
}
