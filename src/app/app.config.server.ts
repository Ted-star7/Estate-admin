import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Import withFetch
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    provideHttpClient(withFetch()) // Enable fetch API for HttpClient
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
