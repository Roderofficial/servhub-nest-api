import { Controller, Get, Param, Response, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { MailService } from 'src/mail/mail.service';

/**
 * User controller
 * @category Controllers
 * @class UserController
 */
@Controller('user')
export class UserController {
  /**
   * Creates an instance of UserController.
   * @memberof UserController
   * @constructor
   */
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Find all users
   * @returns {Promise<User[]>}
   * @memberof UserController
   * @method findAll
   * @public
   * @async
   */
  @Get()
  findAll(): any {
    return this.userService.findAll();
  }

  /**
   * Get user by id
   * @param {string} id  The id of the user
   * @returns  {Promise<User>}
   * @memberof UserController
   * @method findOne
   * @public
   * @async
   */
  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.userService.findOne(+id);
  }
}
