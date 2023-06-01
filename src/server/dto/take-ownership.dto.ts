import { IsString, IsNotEmpty } from 'class-validator';

export class TakeOwnershipDto {
  @IsString()
  @IsNotEmpty()
  readonly serverId: string;
}
