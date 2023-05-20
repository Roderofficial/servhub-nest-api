import { Server, ServerStatus } from './server.entity';

export const serverProviders = [
  {
    provide: 'SERVER_REPOSITORY',
    useValue: Server,
  },

  {
    provide: 'SERVER_STATUS_REPOSITORY',
    useValue: ServerStatus,
  },
];
