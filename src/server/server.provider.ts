import { Server } from './server.entity';

export const serverProviders = [
  {
    provide: 'SERVER_REPOSITORY',
    useValue: Server,
  },
];
