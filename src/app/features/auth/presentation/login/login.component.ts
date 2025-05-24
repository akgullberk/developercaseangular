import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { LoginRequest } from '../../domain/models/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          if (response.token) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login hatası:', error);
          this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
          this.isLoading = false;
        }
      });
    }
  }
} 