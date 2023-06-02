import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
/**
 * @class CreateUserDto
 * @description Data transfer object for creating a user
 * @exports CreateUserDto
 */
export class CreateUserDto {
  /**
   * @property {string} username The username of the user
   */
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  /**
   * @property {string} email The email of the user
   */
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
