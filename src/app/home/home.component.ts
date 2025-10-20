import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VolunteerService } from '../services/volunteer.service';
import { CollectService } from '../services/collect.service';
import { forkJoin } from 'rxjs'; //Charger les volontaires et les collectes en parallèle

interface Volunteer {
  id?: number;
  firstname: string;
  lastname: string;
  location: string;
  email: string;
}

interface Collection {
  id: number;
  collectionDate: string;
  city: {
    id: number;
    name?: string;
  };
  status: string;
  wasteCollectionItems: WasteItem[];
}

interface WasteItem {
  id: number;
  quantity: number;
}

interface CityStats {
  name: string;
  volunteersCount: number;
  collectsCount: number;
  totalWaste: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading: boolean = true;
  volunteers: Volunteer[] = [];
  collects: Collection[] = [];
  totalVolunteers: number = 0;
  totalCollects: number = 0;
  totalWaste: number = 0;
  cityStats: CityStats[] = [];

  constructor(
    private volunteerService: VolunteerService,
    private collectService: CollectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      volunteers: this.volunteerService.getVolunteers(),
      collects: this.collectService.getAllCollections()
    }).subscribe({
      next: (data) => {
        this.volunteers = data.volunteers;
        this.collects = data.collects;
        this.totalVolunteers = this.volunteers.length;
        this.totalCollects = this.collects.length;
        this.totalWaste = this.calculateTotalWaste();
        this.calculateCityStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement données:', err);
        this.loading = false;
      }
    });
  }

  calculateTotalWaste(): number {
    let total = 0;
    this.collects.forEach(collect => {
      if (collect.wasteCollectionItems) {
        collect.wasteCollectionItems.forEach(item => {
          total += item.quantity;
        });
      }
    });
    return total;
  }

  calculateCityStats(): void {
    const statsMap = new Map<string, CityStats>();

    this.volunteers.forEach(volunteer => {
      const location = volunteer.location?.trim();
      if (location) {
        if (!statsMap.has(location)) {
          statsMap.set(location, {
            name: location,
            volunteersCount: 0,
            collectsCount: 0,
            totalWaste: 0
          });
        }
        statsMap.get(location)!.volunteersCount++;
      }
    });

    this.collects.forEach(collect => {
      const cityName = collect.city?.name || this.getCityNameById(collect.city?.id);
      if (cityName) {
        if (!statsMap.has(cityName)) {
          statsMap.set(cityName, {
            name: cityName,
            volunteersCount: 0,
            collectsCount: 0,
            totalWaste: 0
          });
        }

        const stats = statsMap.get(cityName)!;
        stats.collectsCount++;

        if (collect.wasteCollectionItems) {
          collect.wasteCollectionItems.forEach(item => {
            stats.totalWaste += item.quantity;
          });
        }
      }
    });

    this.cityStats = Array.from(statsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  getCityNameById(cityId: number | undefined): string {
    if (!cityId) return '';

    const uniqueLocations = this.getUniqueLocations();
    if (cityId > 0 && cityId <= uniqueLocations.length) {
      return uniqueLocations[cityId - 1];
    }
    return '';
  }

  getUniqueLocations(): string[] {
    const locations = this.volunteers
      .map(v => v.location)
      .filter(loc => loc && loc.trim() !== '');
    return [...new Set(locations)].sort();
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

  goToCollections(): void {
    this.router.navigate(['/collects']);
  }
}
