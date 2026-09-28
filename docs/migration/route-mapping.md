# Route Mapping

## Overview

Bu doküman, mevcut Express route'larını yeni Next.js App Router yapısıyla eşleştirir. SEO ve kullanıcı deneyimi için kritik öneme sahiptir.

## Route Mapping Table

### Public Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/` | GET | `/` | `app/page.tsx` | No | Home page |
| `/hakkinda` | GET | `/hakkinda` | `app/hakkinda/page.tsx` | No | About page |
| `/etkinlikler` | GET | `/etkinlikler` | `app/etkinlikler/page.tsx` | No | Events page |
| `/tarihteBugun` | GET | `/tarihte-bugun` | `app/tarihte-bugun/page.tsx` | Yes | Historical events (kebab-case) |
| `/blog` | GET | `/blog` | `app/blog/page.tsx` | No | Blog list with pagination |
| `/blog/:id` | GET | `/blog/[id]` | `app/blog/[id]/page.tsx` | No | Blog detail page |
| `/yardim-destek` | GET | `/yardim-destek` | `app/yardim-destek/page.tsx` | No | Support form |
| `/yardim-destek` | POST | `/yardim-destek` | Server Action | No | Support form submit |

### Authentication Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/kullanici/kayitOl` | GET | `/kayit` | `app/kayit/page.tsx` | Yes | Register page |
| `/kullanici/kayitOl` | POST | `/kayit` | Server Action | No | Register submit |
| `/kullanici/oturumAc` | GET | `/giris` | `app/giris/page.tsx` | Yes | Login page |
| `/kullanici/oturumAc` | POST | `/giris` | Server Action | No | Login submit |
| `/kullanici/cikis` | GET | `/cikis` | Server Action | No | Logout |
| `/sifre-unuttum` | GET | `/sifremi-unuttum` | `app/sifremi-unuttum/page.tsx` | Yes | Password reset page |
| `/sifre-unuttum/kod` | POST | `/sifremi-unuttum/kod` | Server Action | No | Request reset code |
| `/sifre-unuttum/dogrula/:token` | GET | `/sifremi-unuttum/dogrula/[token]` | `app/sifremi-unuttum/dogrula/[token]/page.tsx` | No | Verify reset token |
| `/sifre-unuttum/yeni-sifre` | POST | `/sifremi-unuttum/yeni-sifre` | Server Action | No | Submit new password |

### Account Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/hesap` | GET | `/hesap` | `app/hesap/page.tsx` | No | Account settings |
| `/hesap/profil` | POST | `/hesap/profil` | Server Action | No | Update profile |
| `/hesap/social` | POST | `/hesap/social` | Server Action | No | Update social links |
| `/hesap/cookies` | POST | `/hesap/cookies` | Server Action | No | Update cookie preferences |
| `/hesap/data-usage` | POST | `/hesap/data-usage` | Server Action | No | Update data usage preferences |
| `/hesap/sifre-kod` | POST | `/hesap/sifre-kod` | Server Action | No | Request password change code |
| `/hesap/sifre-dogrula` | POST | `/hesap/sifre-dogrula` | Server Action | No | Verify password change code |
| `/hesap/sifre-yeni` | GET | `/hesap/sifre-yeni` | `app/hesap/sifre-yeni/page.tsx` | No | New password form |
| `/hesap/sifre-yeni` | POST | `/hesap/sifre-yeni` | Server Action | No | Submit new password |
| `/hesap/sil` | POST | `/hesap/sil` | Server Action | No | Delete account |

### Blog Management Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/blog/olustur` | GET | `/blog/olustur` | `app/blog/olustur/page.tsx` | No | Create blog page |
| `/blog/olustur` | POST | `/blog/olustur` | Server Action | No | Create blog submit |
| `/blog/duzenle/:id` | GET | `/blog/[id]/duzenle` | `app/blog/[id]/duzenle/page.tsx` | No | Edit blog page |
| `/blog/duzenle/:id` | POST | `/blog/[id]/duzenle` | Server Action | No | Edit blog submit |
| `/blog/:id/sil` | POST | `/blog/[id]/sil` | Server Action | No | Delete blog |
| `/blog/:id/yorum` | POST | `/blog/[id]/yorum` | Server Action | No | Add comment |
| `/blog/:postId/yorum/:commentId/sil` | POST | `/blog/[postId]/yorum/[commentId]/sil` | Server Action | No | Delete comment |
| `/blog/:postId/yorum/:commentId/duzenle` | GET | `/blog/[postId]/yorum/[commentId]/duzenle` | `app/blog/[postId]/yorum/[commentId]/duzenle/page.tsx` | No | Edit comment page |
| `/blog/:postId/yorum/:commentId/duzenle` | POST | `/blog/[postId]/yorum/[commentId]/duzenle` | Server Action | No | Edit comment submit |

### Profile Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/profile/@:username` | GET | `/u/[username]` | `app/u/[username]/page.tsx` | Yes | Public profile |
| `/profile/@:username/blogs` | GET | `/u/[username]/bloglar` | `app/u/[username]/bloglar/page.tsx` | Yes | User's blogs |
| `/profile/@:username/comments` | GET | `/u/[username]/yorumlar` | `app/u/[username]/yorumlar/page.tsx` | Yes | User's comments |

### Admin Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/admin` | GET | `/admin` | `app/admin/page.tsx` | No | Admin redirect |
| `/admin/giris` | GET | `/admin/giris` | `app/admin/giris/page.tsx` | No | Admin login page |
| `/admin/giris` | POST | `/admin/giris` | Server Action | No | Admin login submit |
| `/admin/cikis` | GET | `/admin/cikis` | Server Action | No | Admin logout |
| `/admin/dashboard` | GET | `/admin/dashboard` | `app/admin/dashboard/page.tsx` | No | Admin dashboard |
| `/admin/kullanicilar` | GET | `/admin/kullanicilar` | `app/admin/kullanicilar/page.tsx` | No | User management |
| `/admin/kullanici/:id` | GET | `/admin/kullanici/[id]` | `app/admin/kullanici/[id]/page.tsx` | No | User detail |
| `/admin/kullanici/:id/sil` | POST | `/admin/kullanici/[id]/sil` | Server Action | No | Delete user |
| `/admin/kullanici/:id/rol` | POST | `/admin/kullanici/[id]/rol` | Server Action | No | Change user role |
| `/admin/bloglar` | GET | `/admin/bloglar` | `app/admin/bloglar/page.tsx` | No | Blog management |
| `/admin/blog/:id/sil` | POST | `/admin/blog/[id]/sil` | Server Action | No | Delete blog |
| `/admin/blog/:id/duzenle` | GET | `/admin/blog/[id]/duzenle` | `app/admin/blog/[id]/duzenle/page.tsx` | No | Edit blog (admin) |
| `/admin/yorumlar` | GET | `/admin/yorumlar` | `app/admin/yorumlar/page.tsx` | No | Comment moderation |
| `/admin/yorum/:id/duzenle` | GET | `/admin/yorum/[id]/duzenle` | `app/admin/yorum/[id]/duzenle/page.tsx` | No | Edit comment (admin) |
| `/admin/yorum/:id/duzenle` | POST | `/admin/yorum/[id]/duzenle` | Server Action | No | Edit comment submit (admin) |
| `/admin/yorum/:id/sil` | POST | `/admin/yorum/[id]/sil` | Server Action | No | Delete comment (admin) |
| `/admin/destek` | GET | `/admin/destek` | `app/admin/destek/page.tsx` | No | Support messages |
| `/admin/destek/:id` | GET | `/admin/destek/[id]` | `app/admin/destek/[id]/page.tsx` | No | Support message detail |

### Legal Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/legal/acik-riza-metni` | GET | `/legal/acik-riza-metni` | `app/legal/acik-riza-metni/page.tsx` | No | Explicit consent |
| `/legal/gizlilik-politikasi` | GET | `/legal/gizlilik-politikasi` | `app/legal/gizlilik-politikasi/page.tsx` | No | Privacy policy |
| `/legal/kullanim-sartlari` | GET | `/legal/kullanim-sartlari` | `app/legal/kullanim-sartlari/page.tsx` | No | Terms of use |
| `/legal/iletisim` | GET | `/legal/iletisim` | `app/legal/iletisim/page.tsx` | No | Contact page |
| `/legal/site-haritasi` | GET | `/legal/site-haritasi` | `app/legal/site-haritasi/page.tsx` | No | Sitemap |

### Upload Routes

| Legacy Route | Method | New Route | Component | Redirect | Notes |
|-------------|--------|-----------|-----------|----------|-------|
| `/upload` | POST | `/api/upload` | Route Handler | No | Image upload (ImageKit) |
| `/api/profile-media` | POST | `/api/profile-media` | Route Handler | No | Profile media upload |

## Redirect Strategy

### Permanent Redirects (301)

```typescript
// app/kullanici/kayitOl/page.tsx → Redirect to /kayit
import { redirect } from 'next/navigation';

export default function LegacyRegisterPage() {
  redirect('/kayit');
}
```

### Legacy Routes Needing Redirects

1. **Authentication Routes**
   - `/kullanici/kayitOl` → `/kayit`
   - `/kullanici/oturumAc` → `/giris`
   - `/sifre-unuttum` → `/sifremi-unuttum`

2. **Profile Routes**
   - `/profile/@:username` → `/u/[username]`
   - `/profile/@:username/blogs` → `/u/[username]/bloglar`
   - `/profile/@:username/comments` → `/u/[username]/yorumlar`

3. **Historical Events**
   - `/tarihteBugun` → `/tarihte-bugun`

### Middleware Redirects

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Legacy route redirects
  if (url.pathname.startsWith('/kullanici/kayitOl')) {
    return NextResponse.redirect(new URL('/kayit', request.url));
  }
  
  if (url.pathname.startsWith('/kullanici/oturumAc')) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }
  
  if (url.pathname.startsWith('/profile/@')) {
    const username = url.pathname.split('/@')[1];
    return NextResponse.redirect(new URL(`/u/${username}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/kullanici/:path*', '/profile/:path*', '/tarihteBugun'],
};
```

## URL Parameter Changes

### Dynamic Routes

| Legacy Pattern | New Pattern | Example |
|---------------|-------------|---------|
| `:id` | `[id]` | `/blog/123` → `/blog/[id]` |
| `:postId` | `[postId]` | `/blog/123/yorum/456` → `/blog/[postId]/yorum/[commentId]` |
| `:commentId` | `[commentId]` | See above |
| `@:username` | `[username]` | `/profile/@john` → `/u/[username]` |
| `:token` | `[token]` | `/sifre-unuttum/dogrula/abc123` → `/sifremi-unuttum/dogrula/[token]` |

### Query Parameters

Most query parameters remain the same:

| Legacy Query | New Query | Notes |
|--------------|-----------|-------|
| `?page=2` | `?page=2` | Pagination |
| `?success=message` | `?success=message` | Success messages |
| `?error=message` | `?error=message` | Error messages |
| `?q=search` | `?q=search` | Search queries |
| `?role=admin` | `?role=admin` | Filters |

## SEO Considerations

### Preserve SEO Value

1. **Keep Important URLs**: Major routes unchanged
2. **Implement 301 Redirects**: Legacy routes redirect permanently
3. **Maintain URL Structure**: Where possible, keep similar structure
4. **Update Sitemap**: Include new URLs in sitemap
5. **Update Internal Links**: Update internal references

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://msfl-tarih-kulubu.vercel.app';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hakkinda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ... more URLs
  ];
}
```

## Canonical URLs

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://msfl-tarih-kulubu.vercel.app'),
};
```

## Migration Checklist

### Redirect Implementation

- [ ] Implement middleware redirects for legacy routes
- [ ] Create redirect pages for complex redirects
- [ ] Test all legacy redirects (301 status)
- [ ] Update internal links to new routes
- [ ] Update sitemap with new URLs

### Route Implementation

- [ ] Implement all public routes
- [ ] Implement all authentication routes
- [ ] Implement all account routes
- [ ] Implement all blog management routes
- [ ] Implement all profile routes
- [ ] Implement all admin routes
- [ ] Implement all legal routes
- [ ] Implement all upload routes

### URL Testing

- [ ] Test all legacy URLs redirect correctly
- [ ] Test all new URLs work correctly
- [ ] Test dynamic routes with various parameters
- [ ] Test query parameters work correctly
- [ ] Test 404 pages for invalid routes

### SEO Verification

- [ ] Check sitemap includes all new URLs
- [ ] Verify canonical URLs are correct
- [ ] Test meta tags on important pages
- [ ] Check Open Graph tags
- [ ] Verify robots.txt is correct

## Internal Link Updates

### Components to Update

1. **Navigation Components**
   - Navbar links
   - Footer links
   - Breadcrumb navigation

2. **Template Links**
   - Home page links
   - Blog list links
   - Profile links
   - Admin navigation

3. **Redirect Logic**
   - After login redirect
   - After logout redirect
   - After form submission redirect

### Example Update

```typescript
// Before (Legacy)
<a href="/kullanici/oturumAc">Oturum Aç</a>

// After (New)
<a href="/giris">Oturum Aç</a>
```

## Breaking Changes

### User-Facing Changes

1. **URL Changes**
   - `/kullanici/kayitOl` → `/kayit`
   - `/kullanici/oturumAc` → `/giris`
   - `/profile/@username` → `/u/username`
   - `/tarihteBugun` → `/tarihte-bugun`

2. **Mitigation**
   - Implement 301 redirects
   - Update documentation
   - Communicate changes to users

### Developer-Facing Changes

1. **Route Structure**
   - Express routes → Next.js App Router
   - Route handlers → Server Actions
   - Template rendering → React components

2. **Mitigation**
   - Provide migration guide
   - Document new patterns
   - Provide examples

## Rollback Strategy

If URL changes cause issues:

1. **Keep Legacy Routes Active**
   - Maintain redirect pages
   - Keep middleware active
   - Monitor for issues

2. **Quick Rollback**
   - Disable new routes
   - Enable legacy routes
   - Restore previous deployment

3. **Gradual Migration**
   - Test with subset of users
   - Monitor analytics
   - Roll out gradually

## Conclusion

The route mapping strategy ensures:

1. **SEO Preservation**: 301 redirects for legacy routes
2. **User Experience**: Seamless transition for users
3. **Developer Experience**: Clear mapping and documentation
4. **Maintainability**: Organized route structure
5. **Flexibility**: Easy to add new routes

All legacy routes will redirect to new routes, preserving SEO value and user bookmarks while providing a cleaner, more modern URL structure.
