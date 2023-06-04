import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthToken } from './auth.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(userId: number): Promise<string> {
    const token = await this.generateStringToken();
    const expiresAt = this.generateExpirationDate();

    // remove all tokens for this user
    await this.removeUserTokens(userId);

    // create new token
    await AuthToken.create({
      token,
      expiresAt,
      userId,
    });

    return token;
  }

  async validateToken(
    token: string,
    userId: number,
  ): Promise<Object | UnauthorizedException> {
    const tokenDb = await AuthToken.findOne({
      where: {
        token,
        userId,
      },
    });

    if (!tokenDb) {
      throw new UnauthorizedException();
    } else if (tokenDb.expiresAt < new Date()) {
      await tokenDb.destroy();
      throw new UnauthorizedException();
    }

    await AuthToken.destroy({
      where: {
        token,
        userId,
      },
    });

    return {
      access_token: this.jwtService.sign({ id: userId }),
    };
  }

  async removeUserTokens(userId: number): Promise<void> {
    await AuthToken.destroy({
      where: {
        userId,
      },
    });
  }

  private async generateStringToken(): Promise<string> {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  private generateExpirationDate(): Date {
    // expirtation time is 15 minutes
    return new Date(Date.now() + 15 * 60 * 1000);
  }
  async getCode(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw 'USER_NOT_FOUND';
    }
    return this.createToken(user.id);
  }

  async verifyJwtToken(token: string): Promise<Object | UnauthorizedException> {
    const payload = this.jwtService.verify(token);
    return payload;
  }
}
