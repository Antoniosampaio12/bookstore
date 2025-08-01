// src/app/core/services/local-storage.service.ts
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private tokenKey = 'auth_token'

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey)
  }
}
