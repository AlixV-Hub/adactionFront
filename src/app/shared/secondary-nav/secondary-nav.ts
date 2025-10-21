import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-secondary-nav',
  standalone: true,
  imports: [],
  templateUrl: './secondary-nav.html',
  styleUrl: './secondary-nav.css'
})
export class SecondaryNavComponent implements OnInit {
  @Input() title: string = 'Espace Bénévole';
  @Input() showBackButton: boolean = true;
  @Input() backRoute: string = '/volunteer-space';
  @Input() backLabel: string = 'Mon espace';
  @Input() showLogout: boolean = true;
  @Input() showRefresh: boolean = false;
  @Input() showHome: boolean = true;
  @Output() refreshClick = new EventEmitter<void>();

  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  shouldShowBackButton(): boolean {
    if (this.backRoute === '/volunteer-space') {
      return this.showBackButton && this.isAuthenticated;
    }
    return this.showBackButton;
  }

  goBack(): void {
    this.router.navigate([this.backRoute]);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  refresh(): void {
    this.refreshClick.emit();
  }

  logout(): void {

    try {
      this.authService.logout();
      localStorage.clear();
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  }
}
