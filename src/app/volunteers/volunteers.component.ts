import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteerService } from '../services/volunteer.service';
import {Volunteer} from '../models/volunteer.model';

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volunteers.html',
  styleUrls: ['./volunteers.css']
})
export class VolunteersComponent implements OnInit {
  volunteers: Volunteer[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private volunteerService: VolunteerService) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers() {
    this.loading = true;
    this.errorMessage = '';

    this.volunteerService.getVolunteers().subscribe({
      next: (data: Volunteer[]) => {
        this.volunteers = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des volontaires :', error);
        this.errorMessage = 'Impossible de charger les volontaires.';
        this.loading = false;
      }
    });
  }
}
