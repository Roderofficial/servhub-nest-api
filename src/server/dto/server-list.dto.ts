import { IsString, IsNotEmpty } from 'class-validator';

export class ServerListDto {
  @IsString()
  @IsNotEmpty()
  readonly gameId: string;

  @IsString()
  @IsNotEmpty()
  readonly language: string;

  @IsString()
  readonly page = '1';
}
