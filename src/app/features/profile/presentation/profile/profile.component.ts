import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../../../auth/data/services/auth.service';
import { finalize } from 'rxjs/operators';
import { DigitalCardService, DigitalCardResponse } from '../../../digital-card/data/services/digital-card.service';
import { ImageCropperModule, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { FileUploadService } from '../../../digital-card/data/services/file-upload.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  userProfile: UserProfile | null = null;
  digitalCard: DigitalCardResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private digitalCardService: DigitalCardService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loadDigitalCardFullName();
        },
        error: (error) => {
          console.error('Profil yüklenirken hata oluştu:', error);
        }
      });
  }

  loadDigitalCardFullName(): void {
    if (this.userProfile) {
      this.digitalCardService.getDigitalCard(this.userProfile.username).subscribe({
        next: (card) => {
          this.digitalCard = card;
        }
      });
    }
  }

  getInitials(): string {
    if (!this.digitalCard?.fullName) return '';
    return this.digitalCard.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getFullName(): string {
    return this.digitalCard?.fullName || 'İsimsiz Kullanıcı';
  }

  hasProfileImage(): boolean {
    return !!this.digitalCard?.profilePhotoUrl;
  }

  getProfileImage(): string {
    return this.digitalCard?.profilePhotoUrl || '';
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Form gönderme işlemleri
    }
  }
}
