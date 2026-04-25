import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { TRANSACTION_REPOSITORY_TOKEN } from './domain/repositories/transaction.repository.token';
import { TransactionIndexedDBRepository } from './infrastructure/repositories/transaction-indexeddb.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: TRANSACTION_REPOSITORY_TOKEN,
      useClass: TransactionIndexedDBRepository
    }
  ],
};
