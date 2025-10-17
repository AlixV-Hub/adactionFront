import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isSubmitting = true;

    // Appel au service d'authentification
    this.authService.login(this.email, this.password).subscribe({
      next: (volunteer) => {
        this.isSubmitting = false;

        if (volunteer) {
          console.log('✅ Connexion réussie - Redirection vers /volunteer-space');
          this.router.navigate(['/volunteer-space']);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Erreur de connexion:', error);
        this.errorMessage = 'Erreur de connexion au serveur';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/volunteer']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
