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

      await sequelize.sync({ force: false });

      const GameCount = await Game.count();
      if (GameCount === 0) {
        await Game.bulkCreate([
          { title: 'Minecraft Java', name: 'minecraft_java', port: 25565 },
          {
            title: 'Counter-Strike: Global Offensive',
            name: 'csgo',
            port: 27015,
          },
          { title: 'Counter Strike 1.6', name: 'cs16', port: 27015 },
        ]);
      }

      return sequelize;
    },
  },
];
