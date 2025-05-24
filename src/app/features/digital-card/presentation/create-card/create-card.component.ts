import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DigitalCardService, DigitalCardRequest, SocialMediaLink } from '../../data/services/digital-card.service';
import { FileUploadService } from '../../data/services/file-upload.service';
import { finalize } from 'rxjs/operators';
import { ImageCropperModule, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageCropperModule],
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent {
  cardForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  showCropper = false;
  imageChangedEvent: any = null;
  croppedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private digitalCardService: DigitalCardService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      title: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      biography: ['', [Validators.required]],
      github: [''],
      linkedin: [''],
      twitter: [''],
      instagram: [''],
      additionalLinks: this.fb.array([]),
      skills: ['']
    });
  }

  get additionalLinks() {
    return this.cardForm.get('additionalLinks') as FormArray;
  }

  addLink() {
    const linkForm = this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.*')]]
    });
    this.additionalLinks.push(linkForm);
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  private prepareSocialMediaLinks(): SocialMediaLink[] {
    const links: SocialMediaLink[] = [];
    const formValue = this.cardForm.value;

    if (formValue.github) {
      links.push({ 
        platform: 'github',
        url: formValue.github
      });
    }

    if (formValue.linkedin) {
      links.push({ 
        platform: 'linkedin',
        url: formValue.linkedin
      });
    }

    if (formValue.twitter) {
      links.push({ 
        platform: 'twitter',
        url: formValue.twitter
      });
    }

    if (formValue.instagram) {
      links.push({ 
        platform: 'instagram',
        url: formValue.instagram
      });
    }

    formValue.additionalLinks.forEach((link: { title: string; url: string }) => {
        links.push({
        platform: 'custom',
          url: link.url,
          customName: link.title
        });
    });

    return links;
  }

  private prepareSkills(): string[] {
    const skillsString = this.cardForm.get('skills')?.value;
    if (!skillsString) return [];
    return skillsString.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.imageChangedEvent = event;
      this.showCropper = true;
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.objectUrl) {
      // ObjectURL'i base64'e çevir
      this.convertObjectUrlToBase64(event.objectUrl).then(base64 => {
        this.croppedImage = base64;
        this.previewImageUrl = this.croppedImage;
        console.log('Resim base64 formatına dönüştürüldü');
      });
    } else if (event.base64) {
      this.croppedImage = event.base64;
      this.previewImageUrl = this.croppedImage;
      console.log('Resim base64 formatında alındı');
    } else {
      console.error('Resimden base64 verisi alınamadı:', event);
    }
  }

  private async convertObjectUrlToBase64(objectUrl: string): Promise<string> {
      const response = await fetch(objectUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  }

  imageLoaded(image: LoadedImage): void {
    // Resim yüklendi
  }

  loadImageFailed(): void {
    this.errorMessage = 'Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
    this.showCropper = false;
    this.selectedFile = null;
    this.selectedFileName = null;
  }

  cancelCropping(): void {
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.selectedFile = null;
    this.selectedFileName = null;
  }

  async saveCroppedImage(): Promise<void> {
    if (this.croppedImage) {
      // Base64'ü Blob'a çevir
      const response = await fetch(this.croppedImage);
      const blob = await response.blob();
      
      // Blob'dan File oluştur
      const fileName = this.selectedFileName || 'profile-photo.png';
      this.selectedFile = new File([blob], fileName, { type: 'image/png' });
      
      // Önizleme için URL oluştur
      this.previewImageUrl = URL.createObjectURL(this.selectedFile);
      
      // Modal'ı kapat
      this.showCropper = false;
      this.imageChangedEvent = null;
    }
  }

  private async uploadProfilePhoto(): Promise<string | null> {
    if (!this.selectedFile) return null;
    
    try {
      const uploadResult = await this.fileUploadService.uploadProfilePhoto(this.selectedFile).toPromise();
      return uploadResult.url;
    } catch (error) {
      console.error('Profil fotoğrafı yüklenirken hata:', error);
      throw new Error('Profil fotoğrafı yüklenemedi');
    }
  }

  async onSubmit() {
    if (this.cardForm.invalid) {
      this.markFormGroupTouched(this.cardForm);
      return;
    }

      this.isLoading = true;
      this.errorMessage = null;

      try {
      let profilePhotoUrl: string | null = null;

        if (this.selectedFile) {
          profilePhotoUrl = await this.uploadProfilePhoto();
        }

        const cardData: DigitalCardRequest = {
        title: this.cardForm.get('title')?.value,
        fullName: this.cardForm.get('fullName')?.value,
        biography: this.cardForm.get('biography')?.value,
          profilePhotoUrl: profilePhotoUrl || undefined,
          socialMediaLinks: this.prepareSocialMediaLinks(),
          skills: this.prepareSkills()
        };

      await this.digitalCardService.createDigitalCard(cardData).toPromise();
      
      // Başarılı oluşturma sonrası kartlarım sayfasına yönlendir
              this.router.navigate(['/my-cards']);
    } catch (error: any) {
              console.error('Kart oluşturulurken hata:', error);
      this.errorMessage = error.error?.message || 'Kart oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
    } finally {
        this.isLoading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 