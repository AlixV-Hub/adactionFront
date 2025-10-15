
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VolonteerService } from '../services/volonteer.service';
import { Volonteer } from '../models/volonteer.model';

@Component({
  selector: 'app-volonteer-space',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volonteerSpace.component.html',
  styleUrls: ['./volonteerSpace.component.css']
})
export class VolonteerSpaceComponent implements OnInit {
  currentVolunteer: Volonteer | null = null;

  // Mode édition
  isEditMode: boolean = false;
  editForm: Partial<Volonteer> = {};
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private volonteerService: VolonteerService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.currentVolunteer = this.authService.getCurrentVolunteer();

    if (!this.currentVolunteer) {
      console.warn('⚠️ Non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ Volontaire connecté:', this.currentVolunteer);
  }

  // Navigation vers la page de création de collecte
  goToCreateCollect(): void {
    this.router.navigate(['/collect']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  // Édition du profil
  startEdit(): void {
    this.isEditMode = true;
    this.editForm = {
      firstname: this.currentVolunteer!.firstname,
      lastname: this.currentVolunteer!.lastname,
      email: this.currentVolunteer!.email,
      location: this.currentVolunteer!.location
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editForm = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile(): void {
    if (!this.currentVolunteer || !this.currentVolunteer.id) {
      this.errorMessage = 'Erreur : utilisateur non identifié';
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Préparer les données à envoyer
    const updatedData: Volonteer = {
      id: this.currentVolunteer.id,
      firstname: this.editForm.firstname || this.currentVolunteer.firstname,
      lastname: this.editForm.lastname || this.currentVolunteer.lastname,
      email: this.editForm.email || this.currentVolunteer.email,
      location: this.editForm.location || this.currentVolunteer.location
    };

    this.volonteerService.updateVolonteer(this.currentVolunteer.id, updatedData).subscribe({
      next: (updated: Volonteer) => {
        console.log('✅ Profil mis à jour:', updated);
        this.currentVolunteer = updated;
        this.authService.setCurrentVolunteer(updated);
        this.successMessage = 'Profil mis à jour avec succès !';
        this.isSaving = false;
        this.isEditMode = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        console.error('❌ Erreur mise à jour:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isSaving = false;
      }
    });
  }

  // Utilitaires
  getInitials(): string {
    if (!this.currentVolunteer) return '?';
    const first = this.currentVolunteer.firstname?.charAt(0) || '';
    const last = this.currentVolunteer.lastname?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }
}
