// Charge Zone.js pour les tests
import 'zone.js';            
import 'zone.js/testing';    

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';

// Initialise l'environnement Angular pour les tests
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
