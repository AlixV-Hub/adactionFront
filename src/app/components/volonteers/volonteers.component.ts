import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolonteerService } from '../../services/volonteer.service';
import { Volonteer } from '../../models/volonteer.model';

@Component({
  selector: 'app-volonteers',
  standalone: true,
  imports: [CommonModule], // ✅ Important pour *ngIf, *ngFor et HttpClient
  templateUrl: './volonteers.html',
  styleUrls: ['./volonteers.css']
})
export class VolonteersComponent implements OnInit {
  volonteers: Volonteer[] = [];
  loading = true;
  errorMessage = '';

  constructor(private volonteerService: VolonteerService) {}

  ngOnInit(): void {
    this.loadVolonteers();
  }

  loadVolonteers(): void {
    this.volonteerService.getAllVolonteers().subscribe({
      next: (data) => {
        console.log('✅ Données reçues du backend :', data);
        this.volonteers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur de chargement des volontaires :', error);
        this.errorMessage = 'Impossible de charger les volontaires.';
        this.loading = false;
      },
    });
  }
}
