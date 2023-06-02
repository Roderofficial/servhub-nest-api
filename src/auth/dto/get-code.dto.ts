import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @class GetCodeDto
 * @description Data transfer object for getting a code
 * @exports GetCodeDto
 */
export class GetCodeDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
