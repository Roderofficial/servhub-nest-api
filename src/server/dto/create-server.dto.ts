import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  readonly ip: string;

  @IsString()
  readonly port: string;

  @IsString()
  @IsNotEmpty()
  readonly gameID: string;
}
