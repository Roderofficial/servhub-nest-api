import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class ServerListDto {
  @IsNumber()
  @IsNotEmpty()
  readonly gameId: string;

  @IsString()
  @IsOptional()
  readonly language: string;

  @IsNumber()
  @IsNotEmpty()
  readonly page = '1';
}
