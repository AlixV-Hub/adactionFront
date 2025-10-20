import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteerService } from '../services/volunteer.service';
import { Volunteer } from '../models/volunteer.model';
import { SecondaryNavComponent } from '../shared/secondary-nav/secondary-nav';

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [CommonModule, SecondaryNavComponent],
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.css']
})
export class VolunteersComponent implements OnInit {
  volunteers: Volunteer[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private volunteerService: VolunteerService) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.volunteerService.getVolunteers().subscribe({
      next: (data: Volunteer[]) => {
        this.volunteers = data.map(v => new Volunteer(v));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des volontaires:', error);
        this.errorMessage = 'Impossible de charger les volontaires.';
        this.loading = false;
      }
    });
  }
}
