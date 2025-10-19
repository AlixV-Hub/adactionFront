import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secondary-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondary-nav.html',
  styleUrl: './secondary-nav.css'
})
export class SecondaryNavComponent {
  @Input() title: string = 'Espace Bénévole';
  @Input() showBackButton: boolean = true;
  @Input() backRoute: string = '/volunteer-space';
  @Input() backLabel: string = 'Mon espace';
  @Input() showLogout: boolean = true;
  @Input() showRefresh: boolean = false;
  @Output() refreshClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate([this.backRoute]);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  refresh(): void {
    this.refreshClick.emit();
  }

  logout(): void {
    localStorage.removeItem('currentVolunteerId');
    localStorage.removeItem('currentVolunteer');
    this.router.navigate(['/']);
  }
}
