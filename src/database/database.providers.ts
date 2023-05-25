import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { Server } from '../server/server.entity';
import { ServerStatus } from '../server-status/server-status.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'nest',
      });
      sequelize.addModels([User, Game, Server, ServerStatus]);
      sequelize.sync({ force: false });
      return sequelize;
    },
  },
];
