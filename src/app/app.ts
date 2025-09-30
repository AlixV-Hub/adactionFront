import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // si tu es en standalone
  imports: [JsonPipe], // ✅ ici on ajoute JsonPipe
  template: `<h1>Users</h1><pre>{{ users | json }}</pre>`
})
export class App {
  users = { name: "Alix", age: 37 };
}
