import { IsNotEmpty, IsString } from 'class-validator';

export class GetCodeDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
