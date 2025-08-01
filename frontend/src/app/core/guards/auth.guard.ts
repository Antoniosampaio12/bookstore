// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core'
import {
  CanActivate,
  Router,
} from '@angular/router'
import { LocalStorageService } from '../services/local-storage.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: LocalStorageService) {}

  canActivate(): boolean {
    if (this.storage.getToken()) {
      return true
    } else {
      this.router.navigate(['/auth/login'])
      return false
    }
  }
}
