import { Component } from '@angular/core';
import { VolonteersComponent } from './components/volonteers/volonteers.component';
import { AddVolonteerComponent } from './addvolonteer/addvolonteer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VolonteersComponent, AddVolonteerComponent],
  template: `
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">Liste des volontaires</h1>
      <app-volonteers></app-volonteers>

      <h2 class="text-xl font-semibold mt-6 mb-2">Ajouter un volontaire</h2>
      <app-addvolonteer></app-addvolonteer>
    </main>
  `,
})
export class App {}
