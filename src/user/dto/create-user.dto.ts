import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
