import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  showProfilePopover = false;
  userProfile: UserProfile | null = null;
  loadingProfile = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.router.navigate(['/books']);
        } else {
          this.router.navigate(['/auth']);
        }
      }
    );
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logout realizado com sucesso
        //console.log('Logout realizado com sucesso');
      },
      error: (error) => {
        // Mesmo com erro, o token local foi removido
        // console.error('Erro durante logout:', error);
      }
    });
  }

  onProfileClick(): void {
    if (this.showProfilePopover) {
      this.showProfilePopover = false;
      return;
    }

    if (!this.userProfile) {
      this.loadingProfile = true;
      this.authService.getProfile().subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loadingProfile = false;
          this.showProfilePopover = true;
        },
        error: (error) => {
          console.error('Erro ao carregar perfil:', error);
          this.loadingProfile = false;
        }
      });
    } else {
      this.showProfilePopover = true;
    }
  }

  closeProfilePopover(): void {
    this.showProfilePopover = false;
  }
}