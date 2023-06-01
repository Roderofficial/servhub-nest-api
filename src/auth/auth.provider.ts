import { AuthToken } from './auth.entity';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: AuthToken,
  },
];
