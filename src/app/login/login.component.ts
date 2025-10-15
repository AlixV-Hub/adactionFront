
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isSubmitting = true;

    // Simulation d'authentification
    setTimeout(() => {
      if (this.email && this.password) {
        // Stocker l'état de connexion
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', this.email);

        // Stocker un utilisateur fictif pour le test
        const mockUser = {
          id: 1,
          firstname: 'Jean',
          lastname: 'Dupont',
          email: this.email,
          location: 'Paris'
        };
        sessionStorage.setItem('currentUser', JSON.stringify(mockUser));

        console.log('✅ Connexion réussie - Redirection vers /volonteer-space');

        // Rediriger vers l'espace volontaire
        this.router.navigate(['/volonteer-space']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.isSubmitting = false;
      }
    }, 500);
  }

  goToRegister(): void {
    this.router.navigate(['/volonteer']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
