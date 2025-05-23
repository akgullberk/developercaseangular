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
  template: `
    <div class="create-card-container">
      <div class="create-card-content">
        <h2>Yeni Dijital Kart Oluştur</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form [formGroup]="cardForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Başlık</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title"
              placeholder="Örn: Senior Frontend Developer"
            >
          </div>

          <div class="form-group">
            <label for="fullName">Ad Soyad</label>
            <input 
              type="text" 
              id="fullName" 
              formControlName="fullName"
              placeholder="Örn: Ahmet Yılmaz"
            >
          </div>

          <div class="form-group">
            <label for="biography">Biyografi</label>
            <textarea 
              id="biography" 
              formControlName="biography"
              rows="4"
              placeholder="Kendinizi kısaca tanıtın..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="profileImage">Profil Fotoğrafı</label>
            <div class="file-upload-container">
              <input
                type="file"
                id="profileImage"
                #fileInput
                (change)="onFileSelected($event)"
                accept="image/*"
                style="display: none"
              >
              <button type="button" class="file-upload-btn" (click)="fileInput.click()">
                <i class="fas fa-upload"></i> Profil Fotoğrafı Seç
              </button>
              <span class="file-name">{{ selectedFileName || 'Dosya seçilmedi' }}</span>
            </div>
            <div *ngIf="previewImageUrl" class="image-preview">
              <img [src]="previewImageUrl" alt="Profil fotoğrafı önizleme">
            </div>
          </div>

          <div class="social-links">
            <h3>Sosyal Medya Bağlantıları</h3>
            
            <div class="form-group">
              <label for="github">GitHub</label>
              <input 
                type="text" 
                id="github" 
                formControlName="github"
                placeholder="GitHub profiliniz"
              >
            </div>

            <div class="form-group">
              <label for="linkedin">LinkedIn</label>
              <input 
                type="text" 
                id="linkedin" 
                formControlName="linkedin"
                placeholder="LinkedIn profiliniz"
              >
            </div>

            <div class="form-group">
              <label for="twitter">Twitter</label>
              <input 
                type="text" 
                id="twitter" 
                formControlName="twitter"
                placeholder="Twitter profiliniz"
              >
            </div>

            <div class="form-group">
              <label for="instagram">Instagram</label>
              <input 
                type="text" 
                id="instagram" 
                formControlName="instagram"
                placeholder="Instagram profiliniz"
              >
            </div>

            <div formArrayName="additionalLinks">
              <div *ngFor="let link of additionalLinks.controls; let i = index" [formGroupName]="i" class="additional-link">
                <div class="form-group">
                  <div class="link-header">
                    <label [for]="'linkTitle' + i">Bağlantı Başlığı</label>
                    <button type="button" class="remove-btn" (click)="removeLink(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    [id]="'linkTitle' + i" 
                    formControlName="title"
                    placeholder="Örn: Kişisel Blog"
                  >
                </div>
                <div class="form-group">
                  <label [for]="'linkUrl' + i">Bağlantı URL</label>
                  <input 
                    type="url" 
                    [id]="'linkUrl' + i" 
                    formControlName="url"
                    placeholder="https://..."
                  >
                </div>
              </div>
            </div>

            <button type="button" class="add-link-btn" (click)="addLink()">
              <i class="fas fa-plus"></i> Yeni Bağlantı Ekle
            </button>
          </div>

          <div class="form-group">
            <label for="skills">Yetenekler (virgülle ayırın)</label>
            <input 
              type="text" 
              id="skills" 
              formControlName="skills"
              placeholder="Örn: Angular, TypeScript, React"
            >
          </div>

          <div class="button-group">
            <button type="button" class="cancel-btn" routerLink="/">İptal</button>
            <button type="submit" class="submit-btn" [disabled]="!cardForm.valid || isLoading">
              {{ isLoading ? 'Oluşturuluyor...' : 'Kartı Oluştur' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Resim Kırpma Modalı -->
    <div class="modal" *ngIf="showCropper">
      <div class="modal-content">
        <h2>Profil Fotoğrafını Düzenle</h2>
        <image-cropper
          [imageFile]="imageChangedEvent?.target?.files[0]"
          [maintainAspectRatio]="true"
          [aspectRatio]="1"
          [roundCropper]="true"
          [onlyScaleDown]="true"
          [alignImage]="'center'"
          format="png"
          outputType="base64"
          [resizeToWidth]="300"
          [resizeToHeight]="300"
          [cropperMinWidth]="100"
          [cropperMinHeight]="100"
          (imageCropped)="imageCropped($event)"
          (imageLoaded)="imageLoaded($event)"
          (loadImageFailed)="loadImageFailed()"
          [containWithinAspectRatio]="true"
        ></image-cropper>
        <div class="modal-buttons">
          <button type="button" class="cancel-btn" (click)="cancelCropping()">İptal</button>
          <button type="button" class="save-btn" (click)="saveCroppedImage()">Kaydet</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-card-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;

      h2 {
        color: #2D3748;
        margin-bottom: 2rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4A5568;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: #FF6B00;
            box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
          }

          &::placeholder {
            color: #A0AEC0;
          }
        }
      }

      .social-links {
        background: #F7FAFC;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;

        h3 {
          color: #2D3748;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .additional-link {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #E2E8F0;

          .link-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .remove-btn {
              background: none;
              border: none;
              color: #E53E3E;
              cursor: pointer;
              padding: 0.25rem;
              font-size: 0.9rem;
              transition: all 0.2s;

              &:hover {
                color: #C53030;
                transform: scale(1.1);
              }
            }
          }
        }

        .add-link-btn {
          width: 100%;
          padding: 0.75rem;
          background: #EDF2F7;
          border: 2px dashed #CBD5E0;
          border-radius: 0.5rem;
          color: #4A5568;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;

          i {
            font-size: 0.8rem;
          }

          &:hover {
            background: #E2E8F0;
            border-color: #A0AEC0;
            color: #2D3748;
          }
        }
      }

      .button-group {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;

        button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .cancel-btn {
          background: transparent;
          border: 2px solid #FF6B00;
          color: #FF6B00;

          &:hover {
            background: rgba(255, 107, 0, 0.1);
          }
        }

        .submit-btn {
          background: #FF6B00;
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);

          &:hover {
            box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
          }

          &:disabled {
            background: #CBD5E0;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        }
      }
    }

    .error-message {
      background-color: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #DC2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      white-space: pre-line;
    }

    .file-upload-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .file-upload-btn {
      background: #FF6B00;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;

      &:hover {
        background: #E65A00;
      }

      i {
        font-size: 1rem;
      }
    }

    .file-name {
      color: #718096;
      font-size: 0.9rem;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;

      h2 {
        color: #2D3748;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .modal-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;

        button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;

          &.cancel-btn {
            background: transparent;
            border: 2px solid #FF6B00;
            color: #FF6B00;

            &:hover {
              background: rgba(255, 107, 0, 0.1);
            }
          }

          &.save-btn {
            background: #FF6B00;
            border: none;
            color: white;

            &:hover {
              background: #E65A00;
            }
          }
        }
      }
    }

    .image-preview {
      margin-top: 1rem;
      text-align: center;

      img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 50%;
        border: 2px solid #FF6B00;
        object-fit: cover;
      }
    }
  `]
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
      title: ['', [Validators.required, Validators.maxLength(100)]],
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      biography: ['', [Validators.required, Validators.maxLength(1000)]],
      profileImage: [''],
      github: ['', [Validators.pattern('https?://.+')]],
      linkedin: ['', [Validators.pattern('https?://.+')]],
      twitter: ['', [Validators.pattern('https?://.+')]],
      instagram: ['', [Validators.pattern('https?://.+')]],
      skills: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,]+$/)]],
      additionalLinks: this.fb.array([])
    });
  }

  get additionalLinks() {
    return this.cardForm.get('additionalLinks') as FormArray;
  }

  addLink() {
    const linkGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      url: ['', [Validators.required, Validators.pattern('https?://.+'), Validators.maxLength(500)]]
    });

    this.additionalLinks.push(linkGroup);
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  private prepareSocialMediaLinks(): SocialMediaLink[] {
    const links: SocialMediaLink[] = [];
    const formValue = this.cardForm.value;

    // Standart sosyal medya bağlantıları
    if (formValue.github) {
      links.push({ 
        platform: 'GITHUB', 
        url: formValue.github,
        customName: 'GitHub'
      });
    }
    if (formValue.linkedin) {
      links.push({ 
        platform: 'LINKEDIN', 
        url: formValue.linkedin,
        customName: 'LinkedIn'
      });
    }
    if (formValue.twitter) {
      links.push({ 
        platform: 'TWITTER', 
        url: formValue.twitter,
        customName: 'Twitter'
      });
    }
    if (formValue.instagram) {
      links.push({ 
        platform: 'INSTAGRAM', 
        url: formValue.instagram,
        customName: 'Instagram'
      });
    }

    // Ek bağlantılar
    formValue.additionalLinks?.forEach((link: any) => {
      if (link.url && link.title) {
        links.push({
          platform: 'OTHER',
          url: link.url,
          customName: link.title
        });
      }
    });

    return links;
  }

  private prepareSkills(): string[] {
    const skillsString = this.cardForm.get('skills')?.value || '';
    return skillsString
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length >= 2 && skill.length <= 50);
  }

  onFileSelected(event: Event): void {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin (JPG, JPEG, PNG veya GIF)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      this.imageChangedEvent = event;
      this.showCropper = true;
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    console.log('Resim kırpma eventi tetiklendi:', event);
    
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
    try {
      const response = await fetch(objectUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('ObjectURL base64\'e dönüştürülürken hata:', error);
      throw error;
    }
  }

  imageLoaded(image: LoadedImage): void {
    console.log('Resim yüklendi:', image);
  }

  loadImageFailed(): void {
    console.error('Resim yükleme başarısız!');
    alert('Resim yüklenirken bir hata oluştu!');
    this.cancelCropping();
  }

  cancelCropping(): void {
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.previewImageUrl = null;
    this.selectedFile = null;
    this.selectedFileName = null;
  }

  async saveCroppedImage(): Promise<void> {
    console.log('Kaydet butonuna basıldı');
    console.log('croppedImage durumu:', {
      isDefined: !!this.croppedImage,
      length: this.croppedImage?.length || 0
    });

    if (!this.croppedImage) {
      console.error('croppedImage değişkeni boş!');
      alert('Lütfen önce bir resim seçin ve kırpın!');
      return;
    }

    try {
      let base64Data = this.croppedImage;
      
      // Base64 verisi "data:image/..." ile başlıyorsa, sadece base64 kısmını al
      const base64Prefix = 'base64,';
      const base64Index = base64Data.indexOf(base64Prefix);
      
      if (base64Index !== -1) {
        base64Data = base64Data.substring(base64Index + base64Prefix.length);
      }

      // Base64'ü Blob'a çevir
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      // Blob'dan File oluştur
      const file = new File([blob], 'profile.png', { type: 'image/png' });
      
      this.selectedFile = file;
      this.selectedFileName = 'Kırpılmış resim.png';
      this.showCropper = false;
      
      console.log('Resim başarıyla kaydedildi');
    } catch (error) {
      console.error('Resim kaydedilirken hata:', error);
      alert('Resim kaydedilirken bir hata oluştu!');
    }
  }

  private async uploadProfilePhoto(): Promise<string | null> {
    if (!this.selectedFile) return null;
    
    try {
      const response = await this.fileUploadService.uploadProfilePhoto(this.selectedFile).toPromise();
      return response.fileUrl;
    } catch (error) {
      console.error('Profil fotoğrafı yüklenirken hata:', error);
      throw new Error('Profil fotoğrafı yüklenemedi');
    }
  }

  async onSubmit() {
    if (this.cardForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      try {
        let profilePhotoUrl = null;
        if (this.selectedFile) {
          profilePhotoUrl = await this.uploadProfilePhoto();
        }

        const formValue = this.cardForm.value;
        const cardData: DigitalCardRequest = {
          fullName: formValue.fullName,
          profilePhotoUrl: profilePhotoUrl || undefined,
          title: formValue.title,
          biography: formValue.biography,
          socialMediaLinks: this.prepareSocialMediaLinks(),
          skills: this.prepareSkills()
        };

        console.log('Gönderilecek veri:', cardData);

        this.digitalCardService.createDigitalCard(cardData)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe({
            next: (response) => {
              console.log('Kart başarıyla oluşturuldu:', response);
              this.router.navigate(['/my-cards']);
            },
            error: (error) => {
              console.error('Kart oluşturulurken hata:', error);
              if (error.error) {
                if (typeof error.error === 'object') {
                  const errorMessages = Object.entries(error.error)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join('\n');
                  this.errorMessage = errorMessages;
                } else if (typeof error.error === 'string') {
                  this.errorMessage = error.error;
                } else {
                  this.errorMessage = 'Kart oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
                }
              } else {
                this.errorMessage = 'Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.';
              }
            }
          });
      } catch (error: any) {
        this.isLoading = false;
        this.errorMessage = error.message || 'Beklenmeyen bir hata oluştu';
      }
    } else {
      this.markFormGroupTouched(this.cardForm);
      this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun ve geçerli değerler girin.';
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