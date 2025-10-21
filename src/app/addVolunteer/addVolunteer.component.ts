import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { VolunteerService } from '../services/volunteer.service';

@Component({
  selector: 'app-addvolunteer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addVolunteer.component.html',
  styleUrls: ['./addVolunteer.component.css']
})
export class AddVolunteerComponent {
  volunteerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

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
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = { ...this.volunteerForm.value };
      delete formData.confirmPassword;

      this.volunteerService.createVolunteer(formData).subscribe({
        next: (res: any) => {
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.isSubmitting = false;
          this.volunteerForm.reset();

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
