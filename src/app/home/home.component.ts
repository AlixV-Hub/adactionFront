
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VolonteerService } from '../services/volonteer.service';


interface Volonteer {
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
  volonteers: Volonteer[] = [];
  totalVolonteers: number = 0;

  constructor(
    private volonteerService: VolonteerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVolonteers();
  }

  loadVolonteers(): void {
    this.loading = true;
    this.volonteerService.getVolonteers().subscribe({
      next: (data: any[]) => {
        this.volonteers = data;
        this.totalVolonteers = data.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement volontaires:', err);
        this.loading = false;
      }
    });
  }

  getUniqueLocations(): string[] {
    const locations = this.volonteers.map(v => v.location);
    return [...new Set(locations)].filter(loc => loc);
  }

  getLocationCount(location: string): number {
    return this.volonteers.filter(v => v.location === location).length;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAddVolonteer(): void {
    this.router.navigate(['/volonteer']);
  }

  goToVolonteers(): void {
    this.router.navigate(['/volonteers']);
  }
}
