
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VolunteerService } from '../services/volunteer.service';

@Component({
  selector: 'app-addvolunteer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addVolunteer.component.html',
  styleUrls: ['./addVolunteer.component.css']
})
export class AddVolunteerComponent {
  volunteerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private router: Router
  ) {
    this.volunteerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.volunteerService.createVolunteer(this.volunteerForm.value).subscribe({
        next: (res: any) => {
          console.log('✅ Volontaire ajouté :', res);
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.isSubmitting = false;
          this.volunteerForm.reset();

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
