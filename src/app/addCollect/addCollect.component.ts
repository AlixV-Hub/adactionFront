import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectService, City } from '../services/collect.service';
import { WasteType } from '../models/waste.model';
import { SecondaryNavComponent } from '../shared/secondary-nav/secondary-nav';
import { HttpClient } from '@angular/common/http';

interface WasteItem {
  wasteTypeId: number;
  quantity: number;
}

@Component({
  selector: 'app-add-collect',
  standalone: true,
  imports: [FormsModule, SecondaryNavComponent],
  templateUrl: './addCollect.component.html',
  styleUrls: ['./addCollect.component.css']
})
export class AddCollectComponent implements OnInit {
  collectDate: string = '';
  cityId: number | null = null;
  cities: City[] = [];
  wasteTypes: WasteType[] = [];
  wasteItems: Map<number, number> = new Map();

  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private collectService: CollectService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCitiesFromAPI();
    this.loadWasteTypes();

    const today = new Date();
    this.collectDate = today.toISOString().split('T')[0];
  }

  loadCitiesFromAPI(): void {
    this.http.get<City[]>('http://localhost:8080/api/cities').subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les villes';
      }
    });
  }

  loadWasteTypes(): void {
    this.collectService.getAllWasteTypes().subscribe({
      next: (data) => {
        this.wasteTypes = data;
        this.wasteTypes.forEach(type => {
          this.wasteItems.set(type.id, 0);
        });
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les types de déchets';
      }
    });
  }
  getQuantity(wasteTypeId: number): number {
    return this.wasteItems.get(wasteTypeId) || 0;
  }

  updateQuantity(wasteTypeId: number, value: string): void {
    const quantity = parseInt(value) || 0;
    this.wasteItems.set(wasteTypeId, Math.max(0, quantity));
  }

  incrementQuantity(wasteTypeId: number, delta: number): void {
    const currentQuantity = this.getQuantity(wasteTypeId);
    const newQuantity = Math.max(0, currentQuantity + delta);
    this.wasteItems.set(wasteTypeId, newQuantity);
  }

  getEmoji(type: WasteType): string {
    const emojiMap: { [key: string]: string } = {
      'Plastique': '🔵',
      'Verre': '🟢',
      'Métal': '⚙️',
      'Papier': '📄',
      'Organique': '🍂',
      'Électronique': '🔌',
      'Autre': '🗑️'
    };
    return emojiMap[type.label] || '📦';
  }

  isFormValid(): boolean {
    return !!(this.collectDate && this.cityId);
  }

  hasWasteSelected(): boolean {
    return Array.from(this.wasteItems.values()).some(quantity => quantity > 0);
  }

  saveCollect(): void {
    if (!this.isFormValid() || !this.hasWasteSelected()) {
      this.errorMessage = 'Veuillez remplir tous les champs et sélectionner au moins un type de déchet';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const selectedCity = this.cities.find(c => c.id === this.cityId);
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const items: WasteItem[] = [];
    this.wasteItems.forEach((quantity, wasteTypeId) => {
      if (quantity > 0) {
        items.push({wasteTypeId, quantity});
      }
    });

    const collectData = {
      collectionDate: this.collectDate,
      city: {
        id: Number(this.cityId)
      },
      wasteCollectionItems: items.map(item => ({
        wasteType: {
          id: item.wasteTypeId
        },
        quantity: item.quantity
      }))
    };

    this.collectService.createCollect(collectData).subscribe({
      next: (response) => {
        this.successMessage = `Collecte enregistrée avec succès pour ${selectedCity?.name} !`;

        setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la création de la collecte:', error);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la collecte';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    const today = new Date();
    this.collectDate = today.toISOString().split('T')[0];
    this.cityId = null;

    this.wasteItems.forEach((_, key) => {
      this.wasteItems.set(key, 0);
    });
  }

  goBack(): void {
    this.router.navigate(['/volunteer-space']);
  }
}
