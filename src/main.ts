import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app/app.routes';
import 'zone.js';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
