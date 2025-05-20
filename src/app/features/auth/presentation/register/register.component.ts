import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9._-]*$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      surname: ['', [
        Validators.required,
        Validators.minLength(2)
      ]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value)
        .pipe(
          catchError(error => {
            console.error('Kayıt işlemi hatası:', error);
            // Status 200 ama hata olarak algılanıyorsa, başarılı olarak değerlendirelim
            if (error.status === 200) {
              return of({ success: true });
            }
            return of({ success: false, error });
          })
        )
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = 'Kayıt işlemi başarılı!';
              // Kullanıcıya başarılı mesajını göstermek için kısa bir süre bekleyelim
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.handleError(response.error);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        });
    }
  }

  private handleError(error: any): void {
    console.error('Hata yönetimi:', error);
    if (error.status === 200) {
      // Status 200 ise başarılı sayalım
      this.successMessage = 'Kayıt işlemi başarılı!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    if (error.error === 'Username already exists') {
      this.errorMessage = 'Bu kullanıcı adı zaten kullanılmakta.';
    } else if (error.error === 'Email already exists') {
      this.errorMessage = 'Bu e-posta adresi zaten kayıtlı.';
    } else {
      this.errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  }
} 