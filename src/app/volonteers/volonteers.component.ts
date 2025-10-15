import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolonteerService } from '../services/volonteer.service';
import {Volonteer} from '../models/volonteer.model';

@Component({
  selector: 'app-volonteers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volonteers.html',
  styleUrls: ['./volonteers.css']
})
export class VolonteersComponent implements OnInit {
  volonteers: Volonteer[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private volonteerService: VolonteerService) {}

  ngOnInit(): void {
    this.loadVolonteers();
  }

  loadVolonteers() {
    this.loading = true;
    this.errorMessage = '';

    this.volonteerService.getVolonteers().subscribe({
      next: (data: Volonteer[]) => {
        this.volonteers = data;
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
