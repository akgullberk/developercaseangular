import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} alanı gereklidir`;
    }

    if (errors['email']) {
      return 'Geçerli bir e-posta adresi giriniz';
    }

    if (errors['minlength']) {
      return `${fieldName} en az ${errors['minlength'].requiredLength} karakter olmalıdır`;
    }

    if (errors['pattern']) {
      switch (fieldName.toLowerCase()) {
        case 'kullanıcı adı':
          return 'Kullanıcı adı sadece harf, rakam ve (._-) karakterlerini içerebilir';
        case 'şifre':
          return 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
        case 'sosyal medya linki':
          return 'Geçerli bir URL giriniz';
        default:
          return 'Geçersiz format';
      }
    }

    return 'Geçersiz değer';
  }

  getPasswordValidationPattern(): string {
    return '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$';
  }

  getUsernameValidationPattern(): string {
    return '^[a-zA-Z0-9._-]{3,}$';
  }
} 