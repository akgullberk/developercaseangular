## Kurulum ve Çalıştırma Adımları

### 1. Gereksinimler

- Node.js (en son kararlı sürüm)
- npm (Node Package Manager)
- Angular CLI

### 2. Proje Kurulumu

1. Projeyi bilgisayarınıza klonlayın:
```bash
git clone [proje-repo-url]
cd developercaseangular
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

### 3. Production Build Oluşturma

Production ortamı için build almak için aşağıdaki komutu çalıştırın:

```bash
ng build --configuration production
```

Bu komut:
- Production ortamı için optimize edilmiş bir build oluşturacak
- `dist/` klasörü altında build dosyalarını oluşturacak

- # Proje Hakkında

Bu proje, profesyonellerin dijital kartvizitlerini oluşturup yönetebilecekleri modern bir web platformudur. Kullanıcılar kendi dijital kartvizitlerini oluşturabilir, düzenleyebilir ve paylaşabilirler.

## Ana Özellikler

### 1. Dijital Kartvizit Oluşturma
- Kişisel profil bilgileri ekleme (isim, unvan, biyografi)
- Profil fotoğrafı yükleme ve düzenleme (kırpma özelliği ile)
- Sosyal medya bağlantıları ekleme:
  - GitHub
  - LinkedIn
  - Twitter
  - Instagram
  - Özel bağlantılar ekleme imkanı

### 2. Yetenek ve Beceri Yönetimi
- Profesyonel becerilerin listesini oluşturma
- Yetenek etiketleri ekleme

### 3. Kartvizit Yönetimi
- Oluşturulan kartvizitleri görüntüleme
- Kartvizitleri düzenleme
- Kartvizitleri silme
- Tüm kartvizitleri listeleme

### 4. İletişim Özellikleri
- Kartvizit sahipleriyle iletişim kurma formu
- İletişim talepleri yönetimi

### 5. Kullanıcı Deneyimi
- Modern ve kullanıcı dostu arayüz
- Responsive tasarım
- Görsel düzenleme araçları
- Anlık önizleme özellikleri

## Teknik Özellikler

- Angular 19 framework'ü ile geliştirilmiş modern bir web uygulaması
- Modüler yapı ve bileşen tabanlı mimari
- Reactive Forms ile form yönetimi
- HTTP client ile RESTful API entegrasyonu
- Görsel işleme ve kırpma özellikleri (ngx-image-cropper)
- Güvenli kimlik doğrulama ve yetkilendirme sistemi

## Hedef Kitle

- Profesyoneller
- İş arayanlar
- Freelancerlar
- Girişimciler
- Şirketler ve kurumsal kullanıcılar

Bu platform, geleneksel kartvizitlerin dijital dünyaya modern bir yaklaşımla taşınmasını sağlayarak, profesyonel ağ oluşturma ve iletişim kurma süreçlerini kolaylaştırmayı hedeflemektedir.

## Kullanılan Teknolojiler
Angular, Java Spring Boot,Rest API, AWS C2, AWS RDS,PostreSQL

## Mimari Yapı

Proje, modern Angular mimarisi kullanılarak geliştirilmiş olup, temiz kod prensipleri ve modüler yapı gözetilerek tasarlanmıştır. Mimari, aşağıdaki ana bileşenlerden oluşmaktadır:

### 1. Katmanlı Mimari (Layered Architecture)

```plaintext
src/
├── app/
│   ├── core/           # Çekirdek modül
│   ├── features/       # Özellik modülleri
│   ├── shared/         # Paylaşılan modül
│   └── app.*          # Ana uygulama dosyaları
```

### 2. Core Module (`/core`)
Uygulamanın çekirdek bileşenlerini içerir:
- `services/`: Singleton servisler
- `guards/`: Rota koruyucuları
- `interceptors/`: HTTP istekleri için interceptor'lar

### 3. Feature Modules (`/features`)
Her bir özellik kendi modülü içinde yapılandırılmıştır:
- `auth/`: Kimlik doğrulama ve yetkilendirme
- `digital-card/`: Dijital kartvizit işlemleri
- `home/`: Ana sayfa
- `projects/`: Proje yönetimi
- `profile/`: Profil yönetimi

### 4. Shared Module (`/shared`)
Uygulama genelinde paylaşılan bileşenler:
- `services/`: Paylaşılan servisler
- Ortak bileşenler ve direktifler

### 5. Domain-Driven Design (DDD) Yaklaşımı
Her feature modülü kendi içinde DDD prensiplerini takip eder:
```plaintext
feature/
├── domain/          # Domain modelleri ve interfaces
├── data/           # Repository ve servisler
└── presentation/   # Bileşenler ve görünüm katmanı
```
### 6. Ekran Görüntüleri(Mobil uyumlu)
![Ekran görüntüsü 2025-05-26 131357](https://github.com/user-attachments/assets/f2f8de34-5787-417e-b4e0-9dd1ef1c2336)
![Ekran görüntüsü 2025-05-26 131420](https://github.com/user-attachments/assets/e2052a88-7536-44b7-ade3-1541271466bd)
![Ekran görüntüsü 2025-05-26 131438](https://github.com/user-attachments/assets/ef8713cc-28a5-4b7d-8453-0aea427875ca)
![Ekran görüntüsü 2025-05-26 131509](https://github.com/user-attachments/assets/9f8a56eb-b548-41db-b807-aad862bc2369)
![Ekran görüntüsü 2025-05-26 131533](https://github.com/user-attachments/assets/49f1d5e4-a5b4-4f12-ba33-192192a935f1)
![Ekran görüntüsü 2025-05-26 131551](https://github.com/user-attachments/assets/b8ac2cfa-b94d-48ce-85b8-0fe704448f95)
![Ekran görüntüsü 2025-05-26 131635](https://github.com/user-attachments/assets/c305ccd5-ec37-45ff-b51c-a7f3bce027d6)
![Ekran görüntüsü 2025-05-26 131658](https://github.com/user-attachments/assets/29c4fee1-55f9-4124-bba1-fe99cec302a7)
![Ekran görüntüsü 2025-05-26 131717](https://github.com/user-attachments/assets/8f2234af-ce89-4429-aecd-bf860cf65cd6)
![Ekran görüntüsü 2025-05-26 131747](https://github.com/user-attachments/assets/12dc38d7-d8cd-44b8-b564-4ce3e309dc8f)
![Ekran görüntüsü 2025-05-26 131806](https://github.com/user-attachments/assets/7a6ea3f6-f467-47e1-81be-1ffba0dd5a83)
![Ekran görüntüsü 2025-05-26 131817](https://github.com/user-attachments/assets/21bbfcd3-654e-4cfb-9f06-f4c13cf2d6b4)
![Ekran görüntüsü 2025-05-26 131923](https://github.com/user-attachments/assets/a5d4ae80-10df-4591-a67d-6178bbf5f771)
![Ekran görüntüsü 2025-05-26 131941](https://github.com/user-attachments/assets/c87bc166-314b-4a77-938d-ddb0dffcf22b)
![Ekran görüntüsü 2025-05-26 132003](https://github.com/user-attachments/assets/97a3f845-c783-4220-9b67-9ff17d27d2a6)
![Ekran görüntüsü 2025-05-26 132011](https://github.com/user-attachments/assets/92235391-fb1d-440d-8a55-f802f5ed6dd1)
