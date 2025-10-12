import { Routes } from '@angular/router';
import { AddCollectComponent } from './addcollect/addcollect.component';
import { AddVolonteerComponent } from './addvolonteer/addvolonteer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'collect', pathMatch: 'full' },
  { path: 'collect', component: AddCollectComponent },
  { path: 'volonteer', component: AddVolonteerComponent },
  { path: '**', redirectTo: 'collect' }
];
