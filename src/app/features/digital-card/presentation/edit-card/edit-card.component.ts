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
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
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