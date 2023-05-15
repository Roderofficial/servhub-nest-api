import { Controller, Get, Param, Response, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(): any {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.userService.findOne(+id);
  }

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
