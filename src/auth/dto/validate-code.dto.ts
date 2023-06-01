import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateCodeDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;
}
