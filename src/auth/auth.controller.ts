import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Response,
  HttpCode,
} from '@nestjs/common';
import { GetCodeDto } from './dto/get-code.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post('get-code')
  async getCode(@Body() getCodeDto: GetCodeDto, @Response() res) {
    const user = await this.userService.findByEmail(getCodeDto.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await this.authService.createToken(user.id);
    await this.mailService.sendCode(user, token);
    return res.status(200).json({ message: 'Code sent' });
  }

  @HttpCode(200)
  @Post('validate-code')
  async validateCode(
    @Body() validateCodeDto: ValidateCodeDto,
    @Response() res,
  ) {
    const user = await this.userService.findByEmail(validateCodeDto.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(validateCodeDto.code, user.id);
    const response = await this.authService.validateToken(
      validateCodeDto.code,
      user.id,
    );
    console.log(response);
    return res.status(200).json(response);
  }

  @Post('register')
  async signup(@Body() registerDto: RegisterDto, @Response() res) {
    const user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await this.userService.create(registerDto);
    return res.status(200).json({ message: 'User created' });
  }
}
