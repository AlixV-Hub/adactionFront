import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddCollectComponent } from './addcollect/addcollect.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AddCollectComponent],
  template: `<app-add-collect></app-add-collect>`,
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'ADACTION';
}
