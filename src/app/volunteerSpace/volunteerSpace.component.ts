import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VolunteerService } from '../services/volunteer.service';
import { Volunteer } from '../models/volunteer.model';
import { SecondaryNavComponent } from '../shared/secondary-nav/secondary-nav';

@Component({
  selector: 'app-volunteer-space',
  standalone: true,
  imports: [FormsModule, SecondaryNavComponent],
  templateUrl: './volunteerSpace.component.html',
  styleUrls: ['./volunteerSpace.component.css']
})
export class VolunteerSpaceComponent implements OnInit {
  currentVolunteer: Volunteer | null = null;
  isEditMode: boolean = false;
  editForm: Partial<Volunteer> = {};
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private volunteerService: VolunteerService
  ) {}

  ngOnInit(): void {
    this.currentVolunteer = this.authService.getCurrentVolunteer();

    if (!this.currentVolunteer) {
      this.router.navigate(['/login']);
      return;
    }
  }

  goToCreateCollect(): void {
    this.router.navigate(['/collect']);
  }

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

    const updatedData: Volunteer = {
      id: this.currentVolunteer.id,
      firstname: this.editForm.firstname || this.currentVolunteer.firstname,
      lastname: this.editForm.lastname || this.currentVolunteer.lastname,
      email: this.editForm.email || this.currentVolunteer.email,
      location: this.editForm.location || this.currentVolunteer.location
    };

    this.volunteerService.updateVolunteer(this.currentVolunteer.id, updatedData).subscribe({
      next: (updated: Volunteer) => {
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
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isSaving = false;
      }
    });
  }

  getInitials(): string {
    if (!this.currentVolunteer) return '?';
    const first = this.currentVolunteer.firstname?.charAt(0) || '';
    const last = this.currentVolunteer.lastname?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }
}
