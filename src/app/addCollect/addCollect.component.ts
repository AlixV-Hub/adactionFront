
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
  templateUrl: './addCollect.component.html',
  styleUrls: ['./addCollect.component.css']
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
        types.forEach(t => this.quantities[t.id] = 0);
        console.log('✅ Types de déchets chargés:', types);
      },
      error: err => {
        console.error('❌ Erreur chargement types de déchets', err);
        this.loadDefaultWasteTypes();
      }
    });
  }

  loadDefaultWasteTypes(): void {
    this.wasteTypes = [
      { id: 1, value: 'cigarette', name: 'Mégots', label: 'Cigarette', classname: 'badge-cigarette' },
      { id: 2, value: 'plastic', name: 'Plastique', label: 'Plastique', classname: 'badge-plastic' },
      { id: 3, value: 'glass', name: 'Verre', label: 'Verre', classname: 'badge-glass' },
      { id: 4, value: 'metal', name: 'Métal', label: 'Métal', classname: 'badge-metal' },
      { id: 5, value: 'electronic', name: 'Électronique', label: 'Électronique', classname: 'badge-electronic' },
      { id: 6, value: 'other', name: 'Autre', label: 'Autre', classname: 'badge-other' }
    ];
    this.wasteTypes.forEach(t => this.quantities[t.id] = 0);
  }

  loadCities(): void {
    this.collectService.getCities().subscribe({
      next: (data: City[]) => {
        this.cities = data;
        console.log('✅ Villes chargées:', data);
      },
      error: err => {
        console.error('❌ Erreur chargement villes', err);
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

  updateQuantity(id: number, value: any): void {
    const numValue = Number(value);
    this.quantities[id] = numValue >= 0 ? numValue : 0;
  }

  incrementQuantity(id: number, amount: number): void {
    const current = this.getQuantity(id);
    this.quantities[id] = Math.max(0, current + amount);
  }

  getEmoji(wasteType: WasteType): string {
    const value = (wasteType.value || '').toLowerCase();
    const name = (wasteType.name || '').toLowerCase();

    if (value.includes('cigarette') || name.includes('mégot')) return '🚬';
    if (value.includes('plastic') || name.includes('plastique')) return '♻️';
    if (value.includes('glass') || name.includes('verre')) return '🍾';
    if (value.includes('metal') || name.includes('métal')) return '🔩';
    if (value.includes('electronic') || name.includes('électronique')) return '💻';
    if (value.includes('other') || name.includes('autre')) return '🗑️';
    return '📦';
  }

  isFormValid(): boolean {
    return !!(this.collectDate && this.cityId);
  }

  hasWasteSelected(): boolean {
    return Object.values(this.quantities).some(qty => qty > 0);
  }

  getTotalWeight(): number {
    return Object.values(this.quantities).reduce((sum, qty) => sum + qty, 0);
  }


  saveCollect(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.collectDate || !this.cityId) {
      this.errorMessage = 'Veuillez remplir la date et la ville.';
      return;
    }

    if (!this.hasWasteSelected()) {
      this.errorMessage = 'Veuillez saisir au moins une quantité de déchet.';
      return;
    }

    this.isSubmitting = true;

    const wasteItems = this.wasteTypes
      .filter(t => this.getQuantity(t.id) > 0) // Envoyer seulement les quantités > 0
      .map(t => ({
        wasteType: { id: t.id },
        quantity: this.getQuantity(t.id)
      }));

    const payload = {
      collectionDate: this.collectDate,
      cityId: this.cityId,  // ✅ Juste l'ID, pas un objet
      wasteCollectionItems: wasteItems
    };

    console.log('📤 Envoi du payload:', JSON.stringify(payload, null, 2));

    this.collectService.createCollect(payload).subscribe({
      next: res => {
        console.log('✅ Collecte enregistrée:', res);
        const total = this.getTotalWeight();
        this.successMessage = `Collecte enregistrée avec succès ! Total: ${total.toFixed(1)} kg`;
        this.isSubmitting = false;
        setTimeout(() => this.resetForm(), 2000);
      },
      error: err => {
        console.error('❌ Erreur enregistrement:', err);
        console.error('📋 Détails erreur:', err.error);

        // Afficher le message d'erreur du backend si disponible
        if (err.error && err.error.message) {
          this.errorMessage = `Erreur: ${err.error.message}`;
        } else {
          this.errorMessage = 'Erreur lors de l\'enregistrement. Vérifiez la console pour plus de détails.';
        }
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
}
