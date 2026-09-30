# MSFL Tarih Kulübü — Next.js Rewrite (`rewrite/nextjs`)

Mustafa Saffet Fen Lisesi Tarih Kulübü sitesinin Next.js 16 (App Router,
TypeScript) ile yeniden yazılmış hali. Legacy Express monolit
(`archive/legacy-monolith`) yalnızca içerik/davranış referansıdır;
tasarım ve mimari yenidir. Hedef: Vercel + MongoDB.

## Gereksinimler

- Node.js 20+
- MongoDB (Atlas veya local)
- ImageKit hesabı (görsel depolama)
- SendGrid hesabı (şifre sıfırlama e-postaları)
- Google Gemini API anahtarı (Tarihte Bugün üretimi)

## Kurulum

```bash
npm install
cp .env.example .env
# .env içindeki değerleri doldurun (gerçek secret'ları commit ETMEYİN)
npm run dev
```

Doğrulama:

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment Variables

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `MONGODB_URI` | Evet | MongoDB bağlantı URI'si (server-only) |
| `MONGODB_DB` | Hayır | Veritabanı adı (varsayılan: `tarihKulubu`) |
| `JWT_SECRET` | Evet | Oturum JWT imzası (server-only) |
| `CRON_SECRET` | Evet | `/api/cron/*` Bearer doğrulaması (server-only) |
| `ADMIN_PASSWORD` | Evet* | Admin panel girişi (server-only) |
| `ADMIN_USERNAME` | Hayır | Tanımlıysa admin girişinde de istenir |
| `GEMINI_API_KEY` | Evet | Tarihte Bugün AI üretimi (server-only) |
| `IMAGEKIT_PUBLIC_KEY` | Evet | Görsel yükleme |
| `IMAGEKIT_PRIVATE_KEY` | Evet | Server-only, client'a sızmaz |
| `IMAGEKIT_URL_ENDPOINT` | Evet | ImageKit endpoint |
| `SENDGRID_API_KEY` | Evet | E-posta gönderimi (server-only) |
| `SENDGRID_FROM` | Hayır | Gönderen adresi |
| `NEXT_PUBLIC_SITE_URL` | Hayır | Şifre sıfırlama linkleri (public URL) |

`*ADMIN_PASSWORD` tanımlı değilse admin girişi güvenli şekilde
devre dışı kalır; varsayılan parola oluşturulmaz.

## Veritabanı

Koleksiyonlar: `users`, `posts`, `comments`, `supportmessages`,
`tarihte_bugun`, `backups`. Uygulama açılışta gerekli index'leri
(`users.username`/`email` unique, `tarihte_bugun.dateKey` unique vb.)
kendisi oluşturur. Legacy bcrypt hash'leri uyumludur; mevcut
kullanıcılar aynen giriş yapabilir.

## Admin

- Giriş: `/admin/giris` (env parolası ile)
- Panel: `/admin/dashboard` — kullanıcı, blog, yorum, destek mesajı
  ve Tarihte Bugün yönetimi
- Admin yetkisi `role === "admin"` üzerinden server-side doğrulanır.

## Cron (Tarihte Bugün)

`vercel.json` her gün 06:00 UTC'de `/api/cron/tarihte-bugun`
çağırır. Akış: Bearer(`CRON_SECRET`) doğrulama → `MM-DD` kaydı
varsa Gemini çağrılmadan dön → yoksa Gemini ile 3 olay üret,
doğrula, MongoDB'ye kaydet (`originalAIContent` korunur).

## Deployment (Vercel)

1. Repo'yu Vercel'e bağlayın (mevcut projeyi kullanın).
2. Yukarıdaki environment variable'ları Vercel dashboard'dan tanımlayın.
3. Deploy edin; `npm run build` çıktısı production build'dir.

Notlar:

- Yerel dosya sistemi kullanılmaz (ImageKit + MongoDB).
- MongoDB bağlantısı instance başına tekil istemciyle paylaşılır.
- Rate limiting altyapısı yoktur (bilinen açık, bkz. backlog).

## Güvenlik Notları

- Oturumlar HTTP-only, `SameSite=lax`, production'da `Secure` cookie'dir.
- Blog HTML içerikleri server-side sanitize edilir.
- Şifre sıfırlama token'ları SHA-256 hash'li, 1 saatlik, tek kullanımlıktır.
- Admin ve hesap sayfaları `robots` ile index dışıdır.
