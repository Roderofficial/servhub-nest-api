import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
/**
 * User service
 * @export
 * @class UserService
 */
export class UserService {
  /**
   * Creates an instance of UserService.
   * @memberof UserService
   * @constructor
   */
  constructor(@Inject('USER_REPOSITORY') private userRepository: typeof User) {}

  /**
  Find all users
   * @returns {Promise<User[]>}
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll<User>();
  }

  /**
   * Find one user
   * @param id  The id of the user
   * @returns {Promise<User>}
   * @memberof UserService
   */
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne<User>({
      where: {
        id,
      },
    });
  }

  /**
   * Create user
   * @param createUserDto  The user to create
   * @returns {Promise<User>}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    return user.save();
  }

  /**
   * Find user by email
   * @param email  The email of the user
   * @returns {Promise<User>}
   * @memberof UserService
   */
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne<User>({
      where: {
        email,
      },
    });
  }
}
