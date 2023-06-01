import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { Server } from '../server/server.entity';
import { ServerStatus } from '../server-status/server-status.entity';
import { AuthToken } from '../auth/auth.entity';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mariadb',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
      });
      sequelize.addModels([User, Game, Server, ServerStatus, AuthToken]);
      sequelize.sync({ force: false });
      return sequelize;
    },
  },
];
