// src/app/addcollect/addcollect.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectService, City } from '../services/collect.service';
import { WasteType } from '../models/waste.model';

@Component({
  selector: 'app-add-collect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addcollect.component.html',
  styleUrls: ['./addcollect.component.css']
})
export class AddCollectComponent implements OnInit {
  wasteTypes: WasteType[] = [];
  quantities: { [key: number]: number } = {};
  collectDate: string = '';
  cityId: number | null = null;
  cities: City[] = [];
  
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private collectService: CollectService,
    private router: Router
  ) {
    // Initialiser avec la date d'aujourd'hui
    const today = new Date();
    this.collectDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadWasteTypes();
    this.loadCities();
  }

  loadWasteTypes(): void {
    this.collectService.getAllWasteTypes().subscribe({
      next: (types: WasteType[]) => {
        this.wasteTypes = types;
        // Initialiser les quantités à 0
        types.forEach(t => this.quantities[t.id] = 0);
        console.log('✅ Types de déchets chargés:', types);
      },
      error: err => {
        console.error('❌ Erreur chargement types de déchets', err);
        this.errorMessage = 'Erreur lors du chargement des types de déchets';
        // Charger des types par défaut
        this.loadDefaultWasteTypes();
      }
    });
  }

  // Types de déchets par défaut si le backend ne répond pas
  loadDefaultWasteTypes(): void {
    this.wasteTypes = [
      { id: 1, value: 'cigarette', label: 'Cigarette', name: 'Megots de cigarette', classname: 'badge-cigarette' },
      { id: 2, value: 'plastic', label: 'Plastic', name: 'Plastique', classname: 'badge-plastic' },
      { id: 3, value: 'glass', label: 'Glass', name: 'Verre', classname: 'badge-glass' },
      { id: 4, value: 'metal', label: 'Metal', name: 'Métal', classname: 'badge-metal' },
      { id: 5, value: 'electronic', label: 'Electronic', name: 'Électronique', classname: 'badge-electronic' },
      { id: 6, value: 'other', label: 'Other', name: 'Autre', classname: 'badge-other' }
    ];
    this.wasteTypes.forEach(t => this.quantities[t.id] = 0);
  }

  loadCities(): void {
    this.collectService.getCities().subscribe({
      next: data => {
        this.cities = data;
        console.log('✅ Villes chargées:', data);
      },
      error: err => {
        console.error('❌ Erreur chargement villes', err);
        // Villes par défaut
        this.cities = [
          { id: 1, name: 'Paris' },
          { id: 2, name: 'Nantes' },
          { id: 3, name: 'Lyon' },
          { id: 4, name: 'Besançon' },
          { id: 5, name: 'Saintes' }
        ];
      }
    });
  }

  getQuantity(id: number): number {
    return this.quantities[id] || 0;
  }

  updateQuantity(id: number, value: string | number): void {
    const numValue = Number(value);
    this.quantities[id] = numValue >= 0 ? numValue : 0;
  }

  // 🎯 FONCTION POUR LES ÉMOJIS
  getEmoji(wasteType: WasteType): string {
    // Chercher dans value, label et name
    const value = (wasteType.value || '').toLowerCase();
    const label = (wasteType.label || '').toLowerCase();
    const name = (wasteType.name || '').toLowerCase();
    
    // Vérifier chaque type
    if (value.includes('cigarette') || name.includes('cigarette') || name.includes('megot')) {
      return '🚬';
    }
    if (value.includes('plastic') || name.includes('plastique') || label.includes('plastic')) {
      return '♻️';
    }
    if (value.includes('glass') || name.includes('verre') || label.includes('glass')) {
      return '🍾';
    }
    if (value.includes('metal') || name.includes('métal') || label.includes('metal')) {
      return '🔩';
    }
    if (value.includes('paper') || name.includes('papier') || label.includes('paper')) {
      return '📄';
    }
    if (value.includes('organic') || name.includes('organique') || label.includes('organic')) {
      return '🍂';
    }
    if (value.includes('electronic') || name.includes('électronique') || label.includes('electronic')) {
      return '💻';
    }
    if (value.includes('other') || name.includes('autre') || label.includes('other')) {
      return '🗑️';
    }

    // Par défaut
    return '📦';
  }

  // Vérifier si au moins un déchet a une quantité > 0
  hasWasteSelected(): boolean {
    return Object.values(this.quantities).some(qty => qty > 0);
  }

  // Calculer le total
  getTotalWeight(): number {
    return Object.values(this.quantities).reduce((sum, qty) => sum + qty, 0);
  }

  // Compter le nombre de types de déchets sélectionnés
  getSelectedWasteCount(): number {
    return Object.values(this.quantities).filter(q => q > 0).length;
  }

  // Valider le formulaire
  isFormValid(): boolean {
    // ✅ On vérifie juste la date et la ville
    return !!(this.collectDate && this.cityId);
  }

  saveCollect(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.collectDate || !this.cityId) {
      this.errorMessage = 'Veuillez remplir la date et la ville.';
      return;
    }

    this.isSubmitting = true;

    // ✅ Préparer TOUS les items, même ceux avec quantité 0
    const wasteItems = this.wasteTypes.map(t => ({
      wasteType: {
        id: t.id
      },
      quantity: this.getQuantity(t.id)
    }));

    const payload = {
      collectionDate: this.collectDate,
      cityId: this.cityId,
      wasteCollectionItems: wasteItems
    };

    console.log('📤 Envoi de la collecte:', payload);

    this.collectService.createCollect(payload).subscribe({
      next: res => {
        console.log('✅ Collecte enregistrée avec succès:', res);
        const totalWeight = this.getTotalWeight();
        this.successMessage = `Collecte enregistrée avec succès ! Total: ${totalWeight.toFixed(1)} kg`;
        this.isSubmitting = false;
        
        // Réinitialiser le formulaire après 2 secondes
        setTimeout(() => {
          this.resetForm();
        }, 2000);
      },
      error: err => {
        console.error('❌ Erreur lors de l\'enregistrement:', err);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la collecte. Vérifiez que le backend est accessible.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    const today = new Date();
    this.collectDate = today.toISOString().split('T')[0];
    this.cityId = null;
    Object.keys(this.quantities).forEach(k => this.quantities[+k] = 0);
    this.isSubmitting = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Incrémenter rapidement
  incrementQuantity(id: number, amount: number): void {
    const current = this.getQuantity(id);
    this.quantities[id] = Math.max(0, current + amount);
  }
}