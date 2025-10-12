import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddVolonteerService } from '../services/addvolonteer.service';

@Component({
  selector: 'app-addvolonteer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addvolonteer.component.html',
  styleUrls: ['./addvolonteer.component.css']
})
export class AddVolonteerComponent {
  volonteerForm: FormGroup;

  constructor(private fb: FormBuilder, private volonteerService: AddVolonteerService) {
    this.volonteerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.volonteerForm.valid) {
      this.volonteerService.addVolonteer(this.volonteerForm.value).subscribe({
        next: (res: any) => console.log('Volontaire ajouté :', res),
        error: (err: any) => console.error('Erreur :', err)
      });
    }
  }
}
