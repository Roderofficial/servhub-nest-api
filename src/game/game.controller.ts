import { Controller, Get, Param, Response, Body, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  findAll(): any {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.gameService.findOne(+id);
  }

  // Dla bezpieczeństwa usunięte
  // @Post('/create')
  // async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
  //   return this.gameService.create(createGameDto);
  // }
}
