import { Inject, Injectable } from '@nestjs/common';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(@Inject('GAME_REPOSITORY') private gameRepository: typeof Game) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.findAll<Game>();
  }

  async findOne(id: number): Promise<Game> {
    return this.gameRepository.findOne<Game>({
      where: {
        id,
      },
    });
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    return await new Game(createGameDto).save();
  }

  async delete(id: number): Promise<void> {
    await this.gameRepository.destroy({
      where: {
        id,
      },
    });
  }
}
