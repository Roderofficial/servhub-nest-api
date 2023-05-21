import { ServerStatus } from './server-status.entity';

export const ServerStatusProviders = [
  {
    provide: 'SERVER_STATUS_REPOSITORY',
    useValue: ServerStatus,
  },
];
