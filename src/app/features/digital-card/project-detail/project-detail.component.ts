import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="project-detail-page">
      <!-- Hero Section -->
      <div class="project-hero">
        <div class="hero-content">
          <h1>E-Ticaret Platformu</h1>
          <p class="project-description">
            Modern bir e-ticaret platformu. React ve Node.js kullanılarak geliştirildi.
            Kullanıcı dostu arayüzü ve gelişmiş özellikleriyle öne çıkan bir proje.
          </p>
          <div class="project-meta">
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>Başlangıç: Ocak 2023</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-code-branch"></i>
              <span>Durum: Aktif Geliştirme</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-container">
        <!-- Proje Detayları -->
        <div class="project-content">
          <!-- Teknolojiler -->
          <section class="section-card">
            <h2>Kullanılan Teknolojiler</h2>
            <div class="tech-stack">
              <div class="tech-item">
                <i class="fab fa-react"></i>
                <span>React.js</span>
                <p>Frontend geliştirme için React kullanıldı.</p>
              </div>
              <div class="tech-item">
                <i class="fab fa-node-js"></i>
                <span>Node.js</span>
                <p>Backend API için Express.js ile Node.js kullanıldı.</p>
              </div>
              <div class="tech-item">
                <i class="fas fa-database"></i>
                <span>MongoDB</span>
                <p>Veritabanı olarak MongoDB tercih edildi.</p>
              </div>
            </div>
          </section>

          <!-- Özellikler -->
          <section class="section-card">
            <h2>Proje Özellikleri</h2>
            <div class="features-grid">
              <div class="feature-item">
                <i class="fas fa-user"></i>
                <h3>Kullanıcı Yönetimi</h3>
                <p>JWT tabanlı kimlik doğrulama ve yetkilendirme sistemi.</p>
              </div>
              <div class="feature-item">
                <i class="fas fa-shopping-cart"></i>
                <h3>Sepet İşlemleri</h3>
                <p>Gelişmiş sepet yönetimi ve ödeme entegrasyonu.</p>
              </div>
              <div class="feature-item">
                <i class="fas fa-search"></i>
                <h3>Arama ve Filtreleme</h3>
                <p>Elasticsearch ile gelişmiş arama özellikleri.</p>
              </div>
              <div class="feature-item">
                <i class="fas fa-mobile-alt"></i>
                <h3>Responsive Tasarım</h3>
                <p>Tüm cihazlarda kusursuz görünüm.</p>
              </div>
            </div>
          </section>

          <!-- Ekran Görüntüleri -->
          <section class="section-card">
            <h2>Ekran Görüntüleri</h2>
            <div class="screenshots-grid">
              <div class="screenshot">
                <img src="assets/images/project1.jpg" alt="Anasayfa">
                <p>Anasayfa Tasarımı</p>
              </div>
              <div class="screenshot">
                <img src="assets/images/project2.jpg" alt="Ürün Listesi">
                <p>Ürün Listesi</p>
              </div>
              <div class="screenshot">
                <img src="assets/images/project3.jpg" alt="Sepet">
                <p>Sepet Sayfası</p>
              </div>
            </div>
          </section>

          <!-- Teknik Detaylar -->
          <section class="section-card">
            <h2>Teknik Detaylar</h2>
            <div class="technical-details">
              <div class="detail-item">
                <h3>Frontend Mimarisi</h3>
                <ul>
                  <li>React Hooks ve Context API</li>
                  <li>Redux Toolkit ile state yönetimi</li>
                  <li>Styled Components ile CSS-in-JS</li>
                  <li>React Router ile sayfalama</li>
                </ul>
              </div>
              <div class="detail-item">
                <h3>Backend Mimarisi</h3>
                <ul>
                  <li>Express.js REST API</li>
                  <li>MongoDB ile veritabanı işlemleri</li>
                  <li>JWT authentication</li>
                  <li>Socket.IO ile gerçek zamanlı işlemler</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Demo ve Kaynaklar -->
          <section class="section-card">
            <h2>Demo ve Kaynaklar</h2>
            <div class="resources">
              <a href="#" class="resource-link">
                <i class="fas fa-globe"></i>
                <span>Canlı Demo</span>
              </a>
              <a href="#" class="resource-link">
                <i class="fab fa-github"></i>
                <span>GitHub Repo</span>
              </a>
              <a href="#" class="resource-link">
                <i class="fas fa-book"></i>
                <span>Dokümantasyon</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-detail-page {
      min-height: 100vh;
      background: #f8fafc;
    }

    .project-hero {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      padding: 4rem 2rem;
      color: white;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .project-description {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 800px;
        line-height: 1.6;
        margin-bottom: 2rem;
      }
    }

    .project-meta {
      display: flex;
      gap: 2rem;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.9;

        i {
          font-size: 1.2rem;
        }
      }
    }

    .content-container {
      max-width: 1200px;
      margin: -2rem auto 0;
      padding: 0 2rem;
      position: relative;
    }

    .section-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        color: #1e293b;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e2e8f0;
      }
    }

    .tech-stack {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;

      .tech-item {
        padding: 1.5rem;
        background: #f8fafc;
        border-radius: 8px;
        
        i {
          font-size: 2rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        span {
          display: block;
          font-size: 1.1rem;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        p {
          color: #475569;
          line-height: 1.5;
        }
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;

      .feature-item {
        padding: 1.5rem;
        background: #f8fafc;
        border-radius: 8px;
        text-align: center;

        i {
          font-size: 2rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        h3 {
          color: #1e293b;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        p {
          color: #475569;
          line-height: 1.5;
        }
      }
    }

    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;

      .screenshot {
        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        p {
          color: #475569;
          text-align: center;
        }
      }
    }

    .technical-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;

      .detail-item {
        h3 {
          color: #1e293b;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            color: #475569;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;

            &::before {
              content: '•';
              color: #2563eb;
              position: absolute;
              left: 0;
            }
          }
        }
      }
    }

    .resources {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      .resource-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #f8fafc;
        color: #1e293b;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background: #2563eb;
          color: white;
        }

        i {
          font-size: 1.2rem;
        }
      }
    }

    @media (max-width: 768px) {
      .project-hero {
        padding: 2rem 1rem;

        h1 {
          font-size: 2rem;
        }
      }

      .content-container {
        padding: 0 1rem;
      }

      .project-meta {
        flex-direction: column;
        gap: 1rem;
      }

      .section-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      // TODO: Proje detaylarını servisten çek
    });
  }
} 