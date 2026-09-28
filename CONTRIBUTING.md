# Contributing to MSFL Tarih Kulübü

## Geliştirme Rehberi

Bu proje MSFL Tarih Kulübü için Next.js rewrite'ıdır. Eğer bu projeye katkıda bulunmak istiyorsanız, aşağıdaki kurallara uymalısınız.

## Branch Stratejisi

### Aktif Branch'ler

- **`main`**: Production kodları (Express + Handlebars). **Asla bu branch'e commit yapmayın.**
- **`rewrite/nextjs`**: Next.js rewrite çalışmaları. Tüm yeni geliştirmeler bu branch'te yapılır.

### Branch Oluşturma

- Yeni bir feature için branch oluşturmayın - `rewrite/nextjs` üzerinde doğrudan çalışın
- Eğer büyük bir feature için ayrı branch gerekirse, `rewrite/nextjs`'ten yeni branch oluşturun
- Branch isimleri: `rewrite/nextjs` tabanlı, anlamlı isimler (örn: `rewrite/nextjs-auth-fix`)

## Commit Convention

### Commit Mesajı Formatı

```
[TYPE] Kısa açıklama

Detaylı açıklama (opsiyonel)
```

### Türler (TYPE)

- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `refactor`: Kod refactor (davranış değişikliği yok)
- `docs`: Dokümantasyon güncellemesi
- `style`: Format/stil değişikliği (kod davranışı değişmez)
- `test`: Test ekleme/güncelleme
- `chore`: Build, config, dependency güncellemeleri

### Örnekler

```
[feat] Authentication session management with HTTP-only cookies
[fix] Blog pagination edge case handling
[refactor] MongoDB connection caching for serverless
[docs] Update AGENTS.md with new branch rules
```

## Pull Request Süreci

Bu proje şu anda aktif rewrite aşamasında olduğundan, PR süreci yoktur. Doğrudan `rewrite/nextjs` branch'inde çalışın.

## Geliştirme Süreci

### 1. Başlamadan Önce

1. `rewrite/nextjs` branch'inde olduğunuzdan emin olun
2. En son değişiklikleri çekin: `git pull origin rewrite/nextjs`
3. AGENTS.md ve bu CONTRIBUTING.md dosyasını okuyun

### 2. Kodlama Kuralları

- TypeScript kullanın (JavaScript dosyaları kabul edilmez)
- Tailwind CSS v4 kullanın (inline styles kullanmayın)
- Server Components tercih edin, Client Components sadece interaksiyon için
- Zod kullanarak validation yapın
- MongoDB native driver kullanın (Mongoose yerine)
- ImageKit entegrasyonunu koruyun
- Mevcut bcrypt hash'lerini koruyun

### 3. Test Zorunlulukları

Şu anda aktif test altyapısı yok. Yeni özellikler için:
- Manuel test zorunludur
- Authentication akışını test edin
- Blog CRUD işlemlerini test edin
- Admin yetkilerini test edin
- Mobile/desktop responsive test edin

### 4. Dokümantasyon

- Yeni route'lar için docs/migration/route-mapping.md'yi güncelleyin
- Veri modeli değişiklikleri için docs/migration/database-compatibility.md'yi güncelleyin
- Architecture değişiklikleri için docs/architecture/*.md dosyalarını güncelleyin

## Code Review

Bu proje şu anda aktif rewrite aşamasında olduğundan, code review süreci yoktur. Kendi kodunuzu gözden geçirin:

- TypeScript hataları yok mu?
- Tailwind CSS doğru kullanılmış mı?
- Server/Client component ayrımı doğru mu?
- Güvenlik açığı var mı?
- Eski URL'ler için redirect var mı?

## Verification

Her commit'ten önce:

1. `npm run build` - Build hatası olmamalı
2. `npm run typecheck` - TypeScript hataları olmamalı
3. Manuel olarak ilgili özellikleri test edin
4. Eski database kayıtlarının doğru render edildiğini kontrol edin

## Sorunlar

Bir sorunla karşılaşırsanız:

1. Önce issue açın (GitHub Issues)
2. Sorunu detaylı açıklayın
3. Reproduce adımlarını belirtin
4. Ekran görüntüsü/terminal çıktısı ekleyin

## Teşekkürler

MSFL Tarih Kulübü'ne katkıda bulunduğunuz için teşekkürler!
