
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VolunteerService } from '../services/volunteer.service';


interface Volunteer {
  id?: number;
  firstname: string;
  lastname: string;
  location: string;
  email: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading: boolean = true;
  volunteers: Volunteer[] = [];
  totalVolunteers: number = 0;

  constructor(
    private volunteerService: VolunteerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers(): void {
    this.loading = true;
    this.volunteerService.getVolunteers().subscribe({
      next: (data: any[]) => {
        this.volunteers = data;
        this.totalVolunteers = data.length;
        this.loading = false;
      },
      error: (err : any ) => {
        console.error('Erreur chargement volontaires:', err);
        this.loading = false;
      }
    });
  }

  getUniqueLocations(): string[] {
    const locations = this.volunteers.map(v => v.location);
    return [...new Set(locations)].filter(loc => loc);
  }

  getLocationCount(location: string): number {
    return this.volunteers.filter(v => v.location === location).length;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAddVolunteer(): void {
    this.router.navigate(['/volunteer']);
  }

  goToVolunteers(): void {
    this.router.navigate(['/volunteers']);
  }
}
