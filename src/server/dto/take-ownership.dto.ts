import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TakeOwnershipDto {
  @IsNumber()
  @IsNotEmpty()
  readonly serverId: string;
}
