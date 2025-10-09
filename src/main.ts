import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // ✅ HttpClient pour tout le projet

bootstrapApplication(App, {
  providers: [importProvidersFrom(HttpClientModule)] // ✅ rend HttpClient disponible
})
.catch(err => console.error(err));
