# GHV MSFL Tarih Kulübü

Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü'nün resmî web
platformu. Kulüp faaliyetlerini ve tarih içeriklerini paylaşmak, öğrencilerin
blog yazmasını ve yorum yapmasını sağlamak amacıyla geliştirilmiş, ticari
olmayan bir kulüp sitesidir.

Next.js (App Router) + TypeScript ile yazılmıştır; veriler MongoDB'de tutulur,
görseller ImageKit üzerinde barındırılır ve site Vercel'de yayınlanır.

## Kulüp Hakkında

Mustafa Saffet Fen Lisesi Tarih Kulübü; tarih bilincini yaymayı, öğrenci
araştırmalarını paylaşmayı ve kültürel mirasa sahip çıkmayı hedefler. Bu site
kulübün dijital arşividir: blog yazıları, etkinlik takvimi, "Tarihte Bugün"
içerikleri ve üye profilleri burada bir araya gelir.

## Özellikler

- **Blog:** Yazı oluşturma, düzenleme ve silme; kapak ve çoklu görsel desteği;
  zengin metin (sanitize edilerek render edilir).
- **Yorumlar:** Oturum açan üyeler yorum yapabilir; kendi yorumlarını
  düzenleyip silebilir.
- **Kullanıcı hesapları ve profiller:** Kayıt, giriş, e-posta ile şifre
  sıfırlama, hesap ayarları; avatar, kapak fotoğrafı, biyografi ve sosyal medya
  bağlantılarıyla herkese açık profil sayfası.
- **Tarihte Bugün:** Günün tarihine ait olaylar; Google Gemini ile üretilen ve
  yönetim panelinden düzenlenebilen içerikler.
- **Etkinlikler:** Yıllık kulüp etkinlik planı.
- **Destek sistemi:** Herkese açık yardım & destek formu; gelen talepler
  yönetim panelinden yönetilir.
- **Yönetim paneli:** Kullanıcı, blog, yorum, destek mesajı ve Tarihte Bugün
  yönetimi; rol yönetimi ve kullanıcı silme.
- **Yasal sayfalar:** Gizlilik politikası, kullanım şartları, açık rıza metni,
  iletişim ve site haritası.

## Teknolojiler

| Alan | Teknoloji |
|---|---|
| Çatı | Next.js 16 (App Router), React 19 |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Veritabanı | MongoDB (native sürücü) |
| Kimlik doğrulama | JWT (jose), HTTP-only çerez, bcrypt şifre hash'i |
| Doğrulama | Zod |
| Görsel depolama | ImageKit |
| E-posta | SendGrid (şifre sıfırlama) |
| Yapay zekâ | Google Gemini (Tarihte Bugün içerik üretimi) |
| Dağıtım | Vercel |

## Kurulum

Gereksinimler: Node.js 20+, bir MongoDB veritabanı ve ilgili servis
hesapları (ImageKit, SendGrid, Google Gemini).

```bash
npm install
cp .env.example .env
# .env içindeki değerleri doldurun (gerçek anahtarları asla commit etmeyin)
npm run dev
```

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışır.

## Ortam Değişkenleri

Secret değerleri repoya yazılmaz; yalnızca isimler listelenmiştir. Ayrıntı
için `.env.example` dosyasına bakın.

| Değişken | Açıklama |
|---|---|
| `MONGODB_URI` | MongoDB bağlantı adresi |
| `MONGODB_DB` | Veritabanı adı (varsayılan: `tarihKulubu`) |
| `JWT_SECRET` | Oturum JWT imzası |
| `CRON_SECRET` | Cron uç noktası Bearer doğrulaması |
| `GEMINI_API_KEY` | Tarihte Bugün içerik üretimi |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit genel anahtarı |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit özel anahtarı (yalnızca sunucu) |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL adresi |
| `SENDGRID_API_KEY` | E-posta gönderimi (yalnızca sunucu) |
| `SENDGRID_FROM` | Gönderen e-posta adresi |
| `ADMIN_PASSWORD` | Yönetim paneli girişi (tanımlı değilse panel kapalıdır) |
| `ADMIN_USERNAME` | Tanımlıysa yönetim girişinde kullanıcı adı da istenir |
| `NEXT_PUBLIC_SITE_URL` | Şifre sıfırlama bağlantılarında kullanılan site adresi |

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # production derlemesi
npm run start      # production sunucusu
npm run lint       # ESLint
npm run typecheck  # TypeScript tip kontrolü
```

## Proje Yapısı

```
app/                # Next.js App Router sayfaları (blog, profil, hesap, admin, legal ...)
components/         # Yeniden kullanılabilir arayüz bileşenleri
lib/
  db/               # MongoDB bağlantısı ve repository katmanı
  auth/             # Oturum ve kimlik doğrulama
  account/ blog/    # Sunucu eylemleri (server actions)
  support/ admin/   # Destek ve yönetim eylemleri
  validation/       # Zod şemaları
  services/         # ImageKit, SendGrid, Gemini, sanitize
types/              # Paylaşılan alan tipleri
public/img/         # Logo, bölüm arka planları ve varsayılan görseller
content/            # Statik kulüp/editoryal içerik
```

## Dağıtım

Proje Vercel üzerinde çalışacak şekilde tasarlanmıştır. Repoyu Vercel'e
bağlayıp yukarıdaki ortam değişkenlerini tanımladıktan sonra deploy edin;
production çıktısı `npm run build` ile üretilir. `vercel.json` günlük
"Tarihte Bugün" cron görevini tanımlar. Yerel dosya sistemi kalıcı veri için
kullanılmaz (görseller ImageKit, veriler MongoDB).

## Güvenlik Notları

- Oturum çerezleri HTTP-only, `SameSite=Lax` ve production'da `Secure`'dur.
- Şifreler bcrypt ile geri döndürülemez biçimde hash'lenir.
- Blog içeriği sunucu tarafında sanitize edilir.
- Şifre sıfırlama kodları SHA-256 hash'li, 1 saat geçerli ve tek kullanımlıktır.
- Yönetim ve hesap sayfaları arama motorlarına kapalıdır.
