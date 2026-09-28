# Implementation Plan

## Overview

Bu doküman, mevcut Express + Handlebars + MongoDB monolith'ten Next.js 16.x App Router + TypeScript + React + MongoDB native driver sistemine geçiş planını detaylandırır.

## Phase 0 — Legacy Audit ✅

### Amaç
Mevcut sistemin tam teknik audit'ini yapmak ve rewrite için temel bilgileri toplamak.

### Kapsam
- ✅ Repository klonlama ve branch analizi
- ✅ Mevcut route'ların, modellerin, middleware'lerin analizi
- ✅ Authentication/authorization akışının anlaşılması
- ✅ ImageKit, SendGrid entegrasyonlarının incelenmesi
- ✅ Veri modeli ve ilişkilerin belgelenmesi

### Çıktılar
- ✅ AGENTS.md güncellemesi
- ✅ CONTRIBUTING.md oluşturma
- ✅ SECURITY.md oluşturma
- 📋 Legacy audit dokümantasyonu (bu phase)

### Riskler
- Düşük risk - sadece analiz çalışması

### Verification
- Tüm mevcut route'lar ve modeller dokümante edildi
- Authentication akışı tam anlaşıldı
- ImageKit ve SendGrid entegrasyonları belirlendi

---

## Phase 1 — Documentation & Architecture

### Amaç
Yeni sistemin mimari dokümantasyonunu oluşturmak ve migration stratejisini belirlemek.

### Kapsam
- Yeni sistem mimari dokümantasyonu
- Database compatibility stratejisi
- Route mapping tablosu
- Design system tanımları
- UI direction belirlenmesi

### Çıktılar
- docs/architecture/overview.md
- docs/architecture/system-architecture.md
- docs/migration/legacy-audit.md
- docs/migration/database-compatibility.md
- docs/migration/route-mapping.md
- docs/design/design-system.md
- docs/design/ui-direction.md

### Bağımlılıklar
- Phase 0 tamamlanmalı

### Riskler
- Düşük risk - dokümantasyon çalışması

### Verification
- Tüm dokümantasyon birbiriyle tutarlı
- Migration stratejisi net ve uygulanabilir
- Design system gerçekçi ve implement edilebilir

---

## Phase 2 — Next.js Foundation

### Amaç
Next.js projesini kurmak ve temel altyapıyı hazırlamak.

### Kapsam
- Next.js 16.x project initialization
- TypeScript configuration
- Tailwind CSS v4 setup
- ESLint/Prettier configuration
- Basic folder structure creation
- Environment variables setup
- Vercel deployment configuration

### Çıktılar
- next.config.js
- tsconfig.json
- tailwind.config.js
- package.json (Next.js dependencies)
- app/ folder structure
- lib/ folder structure
- .env.local template

### Bağımlılıklar
- Phase 1 tamamlanmalı

### Riskler
- Orta risk - configuration hataları build sorunlarına yol açabilir

### Verification
- `npm run dev` çalışıyor
- `npm run build` başarılı
- TypeScript hataları yok
- Tailwind CSS çalışıyor
- Local development environment hazır

---

## Phase 3 — Database Compatibility

### Amaç
MongoDB native driver ile veritabanı bağlantısını kurmak ve mevcut veri ile uyumluluğu sağlamak.

### Kapsam
- MongoDB native driver setup
- Connection pooling (serverless-compatible)
- Repository pattern implementation
- Mevcut veri modellerinin TypeScript interfaces'leri
- Bcrypt hash compatibility layer
- Data migration scriptleri (gerekirse)

### Çıktılar
- lib/db/connection.ts
- lib/db/repositories/
- types/user.ts, types/post.ts, types/comment.ts, types/supportMessage.ts
- Migration scripts (gerekirse)
- Connection test suite

### Bağımlılıklar
- Phase 2 tamamlanmalı

### Riskler
- Yüksek risk - data loss riski var
- Mevcut kullanıcıların şifreleri çalışmalı

### Verification
- Mevcut kullanıcılar giriş yapabiliyor
- Mevcut bloglar okunabiliyor
- Mevcut yorumlar görüntülenebiliyor
- Bcrypt hash uyumluluğu test edildi
- Backup stratejisi hazır

---

## Phase 4 — Authentication

### Amaç
Modern HTTP-only cookie tabanlı authentication sistemini kurmak.

### Kapsam
- JWT token generation/validation
- HTTP-only cookie management
- Session middleware
- Login/register pages
- Password reset flow
- Logout functionality
- Admin authentication

### Çıktılar
- lib/auth/session.ts
- lib/auth/jwt.ts
- lib/auth/middleware.ts
- app/giris/page.tsx
- app/kayit/page.tsx
- app/sifremi-unuttum/page.tsx
- Auth middleware for protected routes

### Bağımlılıklar
- Phase 3 tamamlanmalı

### Riskler
- Yüksek risk - güvenlik açığı riski
- Kullanıcı session'ları bozulabilir

### Verification
- Yeni kullanıcı kayıt olabiliyor
- Mevcut kullanıcılar giriş yapabiliyor
- Password reset çalışıyor
- Admin authentication çalışıyor
- HTTP-only cookies doğru ayarlanmış
- Session expiration doğru çalışıyor

---

## Phase 5 — Public Website

### Amaç
Public sayfaları modern Next.js ile yeniden yazmak.

### Kapsam
- Home page (anasayfa)
- About page (hakkinda)
- Events page (etkinlikler)
- Tarihte Bugün page
- Public profiles
- Legal pages (acik-riza, gizlilik, kullanim-sartlari, iletisim, site-haritasi)
- Basic navigation

### Çıktılar
- app/page.tsx
- app/hakkinda/page.tsx
- app/etkinlikler/page.tsx
- app/tarihte-bugun/page.tsx
- app/u/[username]/page.tsx
- app/legal/*.tsx
- Reusable components (navbar, footer, layout)

### Bağımlılıklar
- Phase 2 tamamlanmalı
- Phase 4 tamamlanmalı (auth için)

### Riskler
- Orta risk - UI/UX sorunları
- Eski URL'ler için redirect stratejisi

### Verification
- Tüm public sayfalar render ediliyor
- Responsive design çalışıyor
- SEO metadata doğru
- Eski URL'ler redirect ediliyor
- Accessibility (WCAG AA) standartları

---

## Phase 6 — Blog & Comments

### Amaç
Blog sistemini ve yorum sistemini yeniden yazmak.

### Kapsam
- Blog list page (pagination)
- Blog detail page
- Blog creation (authenticated)
- Blog editing (owner/admin)
- Blog deletion (owner/admin)
- Comment system (authenticated)
- Comment editing/deletion
- ImageKit integration for blog images

### Çıktılar
- app/blog/page.tsx
- app/blog/[id]/page.tsx
- app/blog/olustur/page.tsx
- app/blog/[id]/duzenle/page.tsx
- Blog components (card, detail, form)
- Comment components
- Server Actions for blog CRUD
- ImageKit upload components

### Bağımlılıklar
- Phase 3 tamamlanmalı (database)
- Phase 4 tamamlanmalı (auth)
- Phase 5 tamamlanmalı (public pages)

### Riskler
- Orta risk - veri kaybı riski
- ImageKit integration hataları

### Verification
- Blog list pagination çalışıyor
- Blog creation/deletion/editing çalışıyor
- Comment system çalışıyor
- ImageKit upload çalışıyor
- Mevcut bloglar doğru render ediliyor
- Mevcut yorumlar doğru görüntüleniyor

---

## Phase 7 — Profiles & Accounts

### Amaç
Kullanıcı profil ve hesap yönetim sistemini yeniden yazmak.

### Kapsam
- Account settings page
- Profile data editing
- Avatar/cover image upload
- Social links management
- Cookie/data-usage preferences
- Password change
- Account deletion (with backup)
- Public profile pages

### Çıktılar
- app/hesap/page.tsx
- app/hesap/profil/page.tsx
- app/hesap/sifre/page.tsx
- app/hesap/sil/page.tsx
- Profile components
- Account settings components
- Server Actions for account operations

### Bağımlılıklar
- Phase 3 tamamlanmalı (database)
- Phase 4 tamamlanmalı (auth)
- Phase 6 tamamlanmalı (blog integration)

### Riskler
- Orta risk - user data riski
- ImageKit avatar/cover hataları

### Verification
- Profile editing çalışıyor
- Avatar/cover upload çalışıyor
- Social links güncellenebiliyor
- Password change çalışıyor
- Account deletion çalışıyor (backup ile)
- Public profile sayfaları çalışıyor

---

## Phase 8 — Admin Panel

### Amaç
Admin panelini modern Next.js ile yeniden yazmak.

### Kapsam
- Admin dashboard (statistics)
- User management (list, detail, role change, delete)
- Blog management (list, edit, delete)
- Comment moderation (list, edit, delete)
- Support message management (list, detail, status)
- Admin authentication
- Admin layout/navigation

### Çıktılar
- app/admin/page.tsx (redirect to dashboard)
- app/admin/dashboard/page.tsx
- app/admin/kullanicilar/page.tsx
- app/admin/kullanici/[id]/page.tsx
- app/admin/bloglar/page.tsx
- app/admin/yorumlar/page.tsx
- app/admin/destek/page.tsx
- Admin components (layout, tables, modals)
- Admin Server Actions

### Bağımlılıklar
- Phase 3 tamamlanmalı (database)
- Phase 4 tamamlanmalı (auth)
- Phase 6 tamamlanmalı (blog)
- Phase 7 tamamlanmalı (profiles)

### Riskler
- Orta risk - authorization hataları
- Data deletion riski

### Verification
- Admin authentication çalışıyor
- Dashboard statistics doğru
- User management çalışıyor
- Blog management çalışıyor
- Comment moderation çalışıyor
- Support message handling çalışıyor
- Role-based access doğru

---

## Phase 9 — Media / ImageKit

### Amaç
ImageKit entegrasyonunu tamamlamak ve optimize etmek.

### Kapsam
- ImageKit service layer
- Upload components (blog images, avatar, cover)
- Image optimization (next/image)
- Image deletion (when content deleted)
- Error handling for upload failures
- Upload limits and validation

### Çıktılar
- lib/services/imagekit.ts
- Image upload components
- Image deletion utilities
- Image optimization configuration

### Bağımlılıklar
- Phase 2 tamamlanmalı (foundation)
- Phase 6 tamamlanmalı (blog images)
- Phase 7 tamamlanmalı (avatar/cover)

### Riskler
- Orta risk - upload hataları
- ImageKit API limitleri

### Verification
- Blog image upload çalışıyor
- Avatar upload çalışıyor
- Cover image upload çalışıyor
- Image deletion çalışıyor
- Error handling doğru
- Upload limits uyguluyor

---

## Phase 10 — SEO / Accessibility / Performance

### Amaç
SEO, accessibility ve performance optimizasyonları yapmak.

### Kapsam
- SEO metadata (title, description, OG tags)
- Sitemap generation
- Robots.txt
- Accessibility (ARIA labels, keyboard navigation, screen reader)
- Performance (lazy loading, image optimization, code splitting)
- Core Web Vitals optimization
- Mobile optimization

### Çıktılar
- app/layout.tsx (metadata)
- app/sitemap.ts
- app/robots.ts
- Accessibility improvements
- Performance optimizations

### Bağımlılıklar
- Phase 5 tamamlanmalı (public pages)
- Phase 6 tamamlanmalı (blog)
- Phase 7 tamamlanmalı (profiles)

### Riskler
- Düşük risk - optimizasyon çalışması

### Verification
- Lighthouse score > 90
- SEO audit başarılı
- Accessibility audit başarılı
- Core Web Vitals good
- Mobile performance iyi

---

## Phase 11 — Testing

### Amaç
Test altyapısını kurmak ve kritik bileşenleri test etmek.

### Kapsam
- Test framework setup (Jest/Playwright)
- Unit tests (utilities, services)
- Integration tests (API routes)
- E2E tests (critical user flows)
- Authentication flow tests
- Blog CRUD tests
- Admin operations tests

### Çıktılar
- jest.config.js
- playwright.config.ts
- __tests__/ folder
- Test coverage report

### Bağımlılıklar
- Phase 8 tamamlanmalı (admin panel)
- Phase 9 tamamlanmalı (media)

### Riskler
- Orta risk - test coverage eksikliği

### Verification
- Critical flows test edildi
- Test coverage > 70%
- All tests passing
- CI/CD integration (opsiyonel)

---

## Phase 12 — Vercel Deployment

### Amaç
Uygulamayı Vercel'e deploy etmek ve production environment'ı hazırlamak.

### Kapsam
- Vercel project setup
- Environment variables configuration
- Custom domain setup
- Build optimization
- Deployment testing
- Production monitoring
- Rollback plan

### Çıktılar
- vercel.json
- Production deployment
- Monitoring setup
- Deployment documentation

### Bağımlılıklar
- Tüm previous phases tamamlanmalı

### Riskler
- Yüksek risk - production deployment
- Environment variable hataları
- Database connection issues

### Verification
- Production deployment başarılı
- Tüm route'lar çalışıyor
- Authentication çalışıyor
- Database connection stabil
- ImageKit integration çalışıyor
- Error monitoring aktif
- Rollback plan hazır

---

## Rollback Plan

Her phase için rollback stratejisi:

1. **Phase 2-12**: Git branch rollback mümkün
2. **Phase 3-12**: Database backup gerekebilir
3. **Phase 12**: Production rollback mekanizması

## Success Criteria

Tüm phase'ler tamamlandığında:

- ✅ Next.js uygulaması production'da çalışıyor
- ✅ Mevcut kullanıcılar giriş yapabiliyor
- ✅ Mevcut bloglar/comments görüntülenebiliyor
- ✅ Yeni özellikler çalışıyor
- ✅ Admin panel çalışıyor
- ✅ Performance ve accessibility standartları karşılanıyor
- ✅ Security açığı yok
- ✅ Eski URL'ler redirect ediliyor

## Timeline Tahmini

- Phase 0-1: 1-2 gün
- Phase 2: 1 gün
- Phase 3: 2-3 gün
- Phase 4: 2-3 gün
- Phase 5: 3-4 gün
- Phase 6: 4-5 gün
- Phase 7: 3-4 gün
- Phase 8: 4-5 gün
- Phase 9: 2-3 gün
- Phase 10: 2-3 gün
- Phase 11: 3-4 gün
- Phase 12: 1-2 gün

**Toplam: 28-41 gün**

## Notes

- Bu plan esnektir, gerekirse ayarlanabilir
- Her phase'de verification zorunludur
- Riskli phase'lerde (3, 4, 12) ekstra dikkat gerekir
- Data backup stratejisi Phase 3'ten önce hazır olmalı
- Production deployment önce staging testi zorunludur
