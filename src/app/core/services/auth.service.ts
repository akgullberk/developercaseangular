import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private storage: StorageService) {}

  getCurrentUsername(): string | null {
    return this.storage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.storage.getItem('token');
  }
} 