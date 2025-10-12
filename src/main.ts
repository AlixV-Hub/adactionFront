import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import 'zone.js';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // ✅ Fournit HttpClient globalement
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
