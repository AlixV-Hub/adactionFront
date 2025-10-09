import { Component } from '@angular/core';
import { VolonteersComponent } from './components/volonteers/volonteers.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VolonteersComponent], // VolonteersComponent importe déjà CommonModule et HttpClientModule
  template: `
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">Liste des volontaires</h1>
      <app-volonteers></app-volonteers>
    </main>
  `,
})
export class App {}
