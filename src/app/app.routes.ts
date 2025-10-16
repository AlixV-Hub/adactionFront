
import { Routes } from '@angular/router';
import { AddCollectComponent } from './addCollect/addCollect.component';
import { AddVolunteerComponent } from './addVolunteer/addVolunteer.component';
import { HomeComponent } from './home/home.component';
import { VolunteersComponent } from './volunteers/volunteers.component';
import { LoginComponent } from './login/login.component';
import { VolunteerSpaceComponent } from './volunteerSpace/volunteerSpace.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'volunteer-space', component: VolunteerSpaceComponent },
  { path: 'collect', component: AddCollectComponent },
  { path: 'volunteer', component: AddVolunteerComponent },
  { path: 'volunteers', component: VolunteersComponent },
  { path: '**', redirectTo: 'home' }
];
