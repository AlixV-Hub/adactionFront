import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollectService } from '../services/collect.service';
import {SecondaryNavComponent} from '../shared/secondary-nav/secondary-nav';

interface Collection {
  id: number;
  collectionDate: string;
  city: {
    id: number;
    name?: string;
  } | null;
  status: string;
  wasteCollectionItems: WasteItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface WasteItem {
  id: number;
  wasteType: {
    id: number;
    name?: string;
  } | null;
  quantity: number;
}

@Component({
  selector: 'app-collects',
  standalone: true,
  imports: [CommonModule, SecondaryNavComponent],
  templateUrl: './collects.component.html',
  styleUrls: ['./collects.component.css']
})
export class CollectsComponent implements OnInit {
  loading: boolean = true;
  collects: Collection[] = [];
  errorMessage: string = '';
  totalCollects: number = 0;
  loadData: any;

  constructor(
    private collectService: CollectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCollects();
  }

  loadCollects(): void {
    this.loading = true;
    this.collectService.getAllCollections().subscribe({
      next: (data: Collection[]) => {
        // Trier par date décroissante (plus récent en premier)
        this.collects = data.sort((a, b) => {
          const dateA = new Date(a.collectionDate).getTime();
          const dateB = new Date(b.collectionDate).getTime();
          return dateB - dateA;
        });
        this.totalCollects = data.length;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des collectes';
        this.loading = false;
      }
    });
  }

  getTotalWeight(collect: Collection): number {
    if (!collect.wasteCollectionItems || collect.wasteCollectionItems.length === 0) {
      return 0;
    }
    return collect.wasteCollectionItems.reduce((sum, item) => sum + item.quantity, 0);
  }



  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  viewCollectDetails(collectId: number): void {
    this.router.navigate(['/collects', collectId]);
  }

  deleteCollect(collectId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')) {
      this.collectService.deleteCollection(collectId).subscribe({
        next: () => {
          console.log('✅ Collecte supprimée');
          this.loadCollects();
        },
        error: (err: any) => {
          console.error('❌ Erreur suppression:', err);
          alert('Erreur lors de la suppression de la collecte');
        }
      });
    }
  }
}
