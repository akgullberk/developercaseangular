import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DigitalCardService, DigitalCardResponse, SocialMediaLink } from '../../data/services/digital-card.service';
import { AuthService } from '../../../auth/data/services/auth.service';
import { CardItemComponent } from '../card-item/card-item.component';
import { DigitalCard } from '../../domain/models/digital-card.model';
import { FileUploadService } from '../../data/services/file-upload.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ImageCropperModule, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardItemComponent, ImageCropperModule],
  template: `
    <div class="edit-card-container">
      <h2>Dijital Kartı Düzenle</h2>
      <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="edit-form-grid">
        <div class="form-group">
          <label for="fullName">Ad Soyad</label>
          <input id="fullName" formControlName="fullName" type="text" />
        </div>
        <div class="form-group">
          <label for="title">Başlık</label>
          <input id="title" formControlName="title" type="text" />
        </div>
        <div class="form-group">
          <label for="biography">Biyografi</label>
          <textarea id="biography" formControlName="biography"></textarea>
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
        </div>
        <div class="social-links">
          <h3>Sosyal Medya Bağlantıları</h3>
          <div class="form-group">
            <label for="github">GitHub</label>
            <input id="github" formControlName="github" type="text" />
          </div>
          <div class="form-group">
            <label for="linkedin">LinkedIn</label>
            <input id="linkedin" formControlName="linkedin" type="text" />
          </div>
          <div class="form-group">
            <label for="twitter">Twitter</label>
            <input id="twitter" formControlName="twitter" type="text" />
          </div>
          <div class="form-group">
            <label for="instagram">Instagram</label>
            <input id="instagram" formControlName="instagram" type="text" />
          </div>
          <div formArrayName="additionalLinks">
            <div *ngFor="let link of additionalLinks.controls; let i = index" [formGroupName]="i" class="additional-link">
              <div class="form-group">
                <label [for]="'linkTitle' + i">Bağlantı Başlığı</label>
                <input [id]="'linkTitle' + i" formControlName="title" type="text" />
              </div>
              <div class="form-group">
                <label [for]="'linkUrl' + i">Bağlantı URL</label>
                <input [id]="'linkUrl' + i" formControlName="url" type="text" />
              </div>
              <button type="button" (click)="removeLink(i)">Kaldır</button>
            </div>
          </div>
          <button type="button" (click)="addLink()">+ Yeni Bağlantı Ekle</button>
        </div>
        <div class="form-group">
          <label for="skills">Yetenekler</label>
          <input type="text" id="skills" formControlName="skills" placeholder="Yetenekleri virgülle ayırarak girin" (input)="onSkillsInput($event)" (keydown)="onSkillsKeydown($event)">
        </div>
        <div class="card-preview-section">
          <h3>Kart Önizleme</h3>
          <div class="preview-container">
            <app-card-item [card]="previewCardData" [maxSkills]="3"></app-card-item>
          </div>
        </div>
        <div style="grid-column: 1 / -1;">
          <button type="submit" [disabled]="!editForm.valid || isLoading" style="width: 100%;">
            {{ isLoading ? 'Kaydediliyor...' : 'Kaydet' }}
          </button>
        </div>
      </form>
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
    .edit-card-container {
      max-width: none;
      width: 100vw;
      min-height: 100vh;
      margin: 0;
      background: #fff;
      border-radius: 0;
      box-shadow: none;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .edit-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem 3rem;
      width: 100%;
      max-width: 1200px;
    }
    .preview-card {
      grid-column: 1 / -1;
      background: #F7FAFC;
      padding: 2rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    .preview-card h3 {
      color: #2D3748;
      margin-bottom: 1rem;
      text-align: center;
    }
    @media (max-width: 900px) {
      .edit-form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem 0;
      }
      .edit-card-container {
        padding: 1rem;
      }
    }
    .form-group, .social-links {
      width: 100%;
    }
    h2 {
      color: #ff6b00;
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2D3748;
      font-weight: 500;
    }
    input, textarea {
      width: 100%;
      padding: 0.7rem;
      border: 1px solid #E2E8F0;
      border-radius: 0.5rem;
      font-size: 1rem;
    }
    .social-links {
      background: #F7FAFC;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .additional-link {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #E2E8F0;
    }
    button[type="submit"] {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(90deg, #ff9800 0%, #ff6b00 100%);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button[type="submit"]:hover:not(:disabled) {
      background: linear-gradient(90deg, #ff6b00 0%, #ff9800 100%);
    }
    button[type="submit"]:disabled {
      background: #CBD5E0;
      color: #fff;
      cursor: not-allowed;
    }
    .card-preview-section {
      grid-column: 1 / -1;
      margin-top: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .card-preview-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .preview-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 768px) {
      .card-preview-section {
        padding: 1rem;
        margin-top: 1.5rem;
      }

      .preview-container {
        padding: 0.5rem;
      }
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
  `]
})
export class EditCardComponent implements OnInit {
  editForm: FormGroup;
  previewCardData: DigitalCard = {
    id: 'preview',
    fullName: '',
    title: '',
    profileImage: '',
    biography: '',
    socialLinks: {},
    skills: []
  };
  isLoading = false;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  showCropper = false;
  imageChangedEvent: any = null;
  croppedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private digitalCardService: DigitalCardService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      title: ['', Validators.required],
      biography: [''],
      github: [''],
      linkedin: [''],
      twitter: [''],
      instagram: [''],
      additionalLinks: this.fb.array([]),
      skills: ['']
    });

    // Form değişikliklerini dinle
    this.editForm.valueChanges.subscribe(formValue => {
      this.updatePreviewCard(formValue);
    });
  }

  get additionalLinks() {
    return this.editForm.get('additionalLinks') as FormArray;
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
        this.previewCardData = {
          ...this.previewCardData,
          profileImage: this.croppedImage
        };
        console.log('Resim base64 formatına dönüştürüldü');
      });
    } else if (event.base64) {
      this.croppedImage = event.base64;
      this.previewCardData = {
        ...this.previewCardData,
        profileImage: this.croppedImage
      };
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

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.digitalCardService.getDigitalCard(profile.username).subscribe({
          next: (card: DigitalCardResponse) => {
            // Sosyal medya linklerini ayır
            const github = card.socialMediaLinks.find(l => l.platform.toLowerCase() === 'github')?.url || '';
            const linkedin = card.socialMediaLinks.find(l => l.platform.toLowerCase() === 'linkedin')?.url || '';
            const twitter = card.socialMediaLinks.find(l => l.platform.toLowerCase() === 'twitter')?.url || '';
            const instagram = card.socialMediaLinks.find(l => l.platform.toLowerCase() === 'instagram')?.url || '';
            // Diğer linkler
            const additional = card.socialMediaLinks.filter(l => !['github','linkedin','twitter','instagram'].includes(l.platform.toLowerCase()));
            this.additionalLinks.clear();
            additional.forEach(link => {
              this.additionalLinks.push(this.fb.group({
                title: [link.customName || ''],
                url: [link.url || '']
              }));
            });
            this.editForm.patchValue({
              fullName: card.fullName,
              title: card.title,
              biography: card.biography,
              github,
              linkedin,
              twitter,
              instagram,
              skills: card.skills ? card.skills.join(', ') : ''
            });

            // Profil fotoğrafını önizlemeye ekle
            if (card.profilePhotoUrl) {
              this.previewCardData = {
                ...this.previewCardData,
                profileImage: card.profilePhotoUrl
              };
            }
          }
        });
      }
    });
  }

  private prepareSocialMediaLinks(): SocialMediaLink[] {
    const links: SocialMediaLink[] = [];
    const formValue = this.editForm.value;

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
    const skillsString = this.editForm.get('skills')?.value || '';
    return skillsString
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length >= 2 && skill.length <= 50);
  }

  async onSubmit() {
    if (this.editForm.valid) {
      this.isLoading = true;

      try {
        let profilePhotoUrl = this.previewCardData.profileImage;
        if (this.selectedFile) {
          const uploadedUrl = await this.uploadProfilePhoto();
          if (uploadedUrl) {
            profilePhotoUrl = uploadedUrl;
          }
        }

        const formValue = this.editForm.value;
        const cardData = {
          fullName: formValue.fullName,
          profilePhotoUrl: profilePhotoUrl || undefined,
          title: formValue.title,
          biography: formValue.biography,
          socialMediaLinks: this.prepareSocialMediaLinks(),
          skills: this.prepareSkills()
        };

        this.digitalCardService.updateDigitalCard(cardData)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe({
            next: (response) => {
              alert('Kart başarıyla güncellendi!');
              this.router.navigate(['/my-cards']);
            },
            error: (error) => {
              console.error('Kart güncellenirken hata:', error);
              alert('Kart güncellenirken bir hata oluştu: ' + (error?.error?.message || error.message || 'Bilinmeyen hata'));
            }
          });
      } catch (error: any) {
        this.isLoading = false;
        alert('Beklenmeyen bir hata oluştu: ' + error.message);
      }
    }
  }

  onSkillsInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const limited = value
      .split(',')
      .map(skill => skill.trim().slice(0, 11))
      .join(', ');
    if (value !== limited) {
      this.editForm.get('skills')?.setValue(limited, { emitEvent: false });
    }
  }

  onSkillsKeydown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Caret'ın bulunduğu yeteneği bul
    const beforeCaret = value.slice(0, selectionStart);
    const afterCaret = value.slice(selectionEnd);
    const beforeComma = beforeCaret.lastIndexOf(',');
    const afterComma = afterCaret.indexOf(',');
    const skillStart = beforeComma === -1 ? 0 : beforeComma + 1;
    const skillEnd = afterComma === -1 ? value.length : selectionEnd + afterComma;
    const currentSkill = value.slice(skillStart, selectionEnd).trim();

    // Eğer aktif yetenek 11 harf ve yeni karakter ekleniyorsa (backspace, delete, ok tuşları hariç)
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Home", "End"];
    if (
      currentSkill.length >= 11 &&
      event.key.length === 1 && // Sadece karakter tuşları
      selectionStart === selectionEnd && // Seçili alan yoksa
      allowedKeys.indexOf(event.key) === -1
    ) {
      event.preventDefault();
    }
  }

  private updatePreviewCard(formValue: any) {
    const socialLinks: { [key: string]: string } = {
      github: formValue.github || undefined,
      linkedin: formValue.linkedin || undefined,
      twitter: formValue.twitter || undefined,
      instagram: formValue.instagram || undefined
    };

    // Ek linkleri ekle
    if (formValue.additionalLinks && Array.isArray(formValue.additionalLinks)) {
      formValue.additionalLinks.forEach((link: any) => {
        let key = (link.title || '').toLowerCase();
        if (key.includes('blog')) key = 'blog';
        if (key.includes('portfolio')) key = 'portfolio';
        if (key.includes('medium')) key = 'medium';
        if (key.includes('youtube')) key = 'youtube';
        if (key.includes('facebook')) key = 'facebook';
        socialLinks[key] = link.url || '';
      });
    }

    // Yetenekleri virgülle ayırıp diziye çevir
    const skills = formValue.skills
      ? formValue.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
      : [];

    this.previewCardData = {
      ...this.previewCardData,
      fullName: formValue.fullName || '',
      title: formValue.title || '',
      biography: formValue.biography || '',
      socialLinks,
      skills
    };
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
} 