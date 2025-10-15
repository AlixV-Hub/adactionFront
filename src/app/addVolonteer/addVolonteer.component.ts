
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VolonteerService } from '../services/volonteer.service';

@Component({
  selector: 'app-addvolonteer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addVolonteer.component.html',
  styleUrls: ['./addVolonteer.component.css']
})
export class AddVolonteerComponent {
  volonteerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private volonteerService: VolonteerService,
    private router: Router
  ) {
    this.volonteerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.volonteerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.volonteerService.createVolonteer(this.volonteerForm.value).subscribe({
        next: (res: any) => {
          console.log('✅ Volontaire ajouté :', res);
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.isSubmitting = false;
          this.volonteerForm.reset();

          // Rediriger vers la page de login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('❌ Erreur :', err);
          this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
