import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectService, City } from '../services/collect.service';
import { WasteType } from '../models/waste.model';
import { SecondaryNavComponent } from '../shared/secondary-nav/secondary-nav';

interface WasteItem {
  wasteTypeId: number;
  quantity: number;
}

@Component({
  selector: 'app-add-collect',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondaryNavComponent],
  templateUrl: './addCollect.component.html',
  styleUrls: ['./addCollect.component.css']
})
export class AddCollectComponent implements OnInit {
  collectDate: string = '';
  cityName: string = '';  // ✅ Utiliser le nom au lieu de l'ID
  cities: City[] = [];
  wasteTypes: WasteType[] = [];
  wasteItems: Map<number, number> = new Map();

  // Mapping des noms de villes vers les IDs de la BDD (colonne id)
  cityIdMap: { [key: string]: number } = {
    'Paris': 1,        // id = 1
    'Marseille': 2,    // id = 2
    'Lyon': 3,         // id = 3
    'Toulouse': 4,     // id = 4
    'Nice': 5,         // id = 5
    'Nantes': 6,       // id = 6
    'Strasbourg': 7,   // id = 7
    'Montpellier': 8,  // id = 8
    'Bordeaux': 9,     // id = 9
    'Lille': 10,       // id = 10
    'Besançon': 11,    // id = 11
    'Besancon': 11,    // Version sans accent
    'Saintes': 12      // id = 12
  };

  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private collectService: CollectService
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadWasteTypes();

    // Définir la date du jour par défaut
    const today = new Date();
    this.collectDate = today.toISOString().split('T')[0];
  }

  loadCities(): void {
    this.collectService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        console.log('✅ Villes chargées:', this.cities);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des villes:', error);
        this.errorMessage = 'Impossible de charger les villes';
      }
    });
  }

  loadWasteTypes(): void {
    this.collectService.getAllWasteTypes().subscribe({
      next: (data) => {
        this.wasteTypes = data;
        console.log('✅ Types de déchets chargés:', this.wasteTypes);

        // Initialiser les quantités à 0
        this.wasteTypes.forEach(type => {
          this.wasteItems.set(type.id, 0);
        });
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des types de déchets:', error);
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
    return !!(this.collectDate && this.cityName);
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

    // ✅ Convertir le nom de ville en ID
    const cityId = this.cityIdMap[this.cityName];

    if (!cityId) {
      this.errorMessage = `Ville "${this.cityName}" non trouvée dans la base de données`;
      console.error('❌ Ville non trouvée:', this.cityName);
      console.log('🗺️ Mapping disponible:', this.cityIdMap);
      return;
    }

    // Debug logs
    console.log('🔍 Ville sélectionnée:', this.cityName);
    console.log('🔍 ID correspondant dans la BDD:', cityId);

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Préparer les items
    const items: WasteItem[] = [];
    this.wasteItems.forEach((quantity, wasteTypeId) => {
      if (quantity > 0) {
        items.push({ wasteTypeId, quantity });
      }
    });

    const collectData = {
      collectionDate: this.collectDate,
      cityId: cityId,  // ✅ Utiliser l'ID réel de la BDD
      items: items
    };

    console.log('📤 Envoi des données:', collectData);

    this.collectService.createCollect(collectData).subscribe({
      next: (response) => {
        console.log('✅ Collecte créée avec succès:', response);
        this.successMessage = `Collecte enregistrée avec succès pour ${this.cityName} !`;

        // Réinitialiser le formulaire
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
    this.cityName = '';

    // Réinitialiser toutes les quantités à 0
    this.wasteItems.forEach((_, key) => {
      this.wasteItems.set(key, 0);
    });
  }

  goBack(): void {
    this.router.navigate(['/volunteer-space']);
  }
}
