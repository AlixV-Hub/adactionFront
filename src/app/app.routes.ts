
import { Routes } from '@angular/router';
import { AddCollectComponent } from './addCollect/addCollect.component';
import { AddVolonteerComponent } from './addVolonteer/addVolonteer.component';
import { HomeComponent } from './home/home.component';
import { VolonteersComponent } from './volonteers/volonteers.component';
import { LoginComponent } from './login/login.component';
import { VolonteerSpaceComponent } from './volonteerSpace/volonteerSpace.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'volonteer-space', component: VolonteerSpaceComponent },
  { path: 'collect', component: AddCollectComponent },
  { path: 'volonteer', component: AddVolonteerComponent },
  { path: 'volonteers', component: VolonteersComponent },
  { path: '**', redirectTo: 'home' }
];
