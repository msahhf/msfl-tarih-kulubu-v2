# Security Policy

## Overview

Bu doküman MSFL Tarih Kulübü Next.js rewrite'ı için güvenlik politikalarını ve best practice'leri tanımlar.

## Authentication & Authorization

### HTTP-Only Cookies

- Tüm authentication session'ları HTTP-only cookies kullanmalı
- Secure flag (production) ve SameSite attribute (lax/strict) zorunlu
- JWT token'ları asla localStorage'da saklanmamalı
- Token expiration süresi: 7 gün (user), 6 saat (admin)

### Password Hashing

- Mevcut bcrypt hash'leri korunmalı (users şifre yenilememeli)
- Yeni kayıtlar için bcrypt cost factor: 10-12
- Password complexity: minimum 8 karakter
- Password reset token'ları 1 saat geçerli olmalı

### Authorization

- Role-based access control (RBAC)
- Rollar: `user`, `admin`
- Server-side validation zorunlu (client-side kontrol yeterli değil)
- Admin routes için middleware protection zorunlu

## Input Validation & Sanitization

### Server-Side Validation

- Tüm user input'ları Zod ile validate edilmeli
- Email, username, URL format validation zorunlu
- String input'lar için trim ve length kontrolü
- SQL/NoSQL injection koruması (MongoDB native driver ile)

### XSS Prevention

- Stored HTML content sanitize edilmeli (DOMPurify veya benzeri)
- Content Security Policy (CSP) header'ları
- User-generated content için HTML escape zorunlu
- Markdown renderer'ları güvenli konfigürasyon

### CSRF Protection

- Next.js için CSRF token kullanımı
- API routes için origin/header validation
- State-changing operations için POST/PUT/DELETE zorunlu

## Rate Limiting

### Endpoint Limits

- Login: 5 attempt per 15 minutes
- Register: 3 attempt per hour
- Password reset: 3 attempt per hour
- API endpoints: 100 request per minute per IP

### Implementation

- Next.js middleware veya custom rate limiter
- IP-based ve user-based tracking
- Redis veya memory-based storage (Vercel Edge config)

## File Upload Security

### ImageKit Integration

- Tüm media upload'ları ImageKit üzerinden
- Never store files locally in production
- File type validation (images only)
- File size limits: 5MB per image, 20MB total

### Upload Validation

- MIME type kontrolü
- File extension whitelist
- Malicious content scanning (ImageKit built-in)
- User authorization kontrolü

## Environment Variables & Secrets

### Required Environment Variables

```env
# MongoDB
MONGO_URL=<connection-string>

# JWT
JWT_SECRET=<strong-random-string>

# ImageKit
IMAGEKIT_PUBLIC_KEY=<public-key>
IMAGEKIT_PRIVATE_KEY=<private-key>
IMAGEKIT_URL_ENDPOINT=<url-endpoint>

# SendGrid
SENDGRID_API_KEY=<api-key>
SENDGRID_FROM=<sender-email>

# Admin
ADMIN_SECRET_TOKEN=<admin-login-token>
```

### Security Rules

- Asla environment variables'i client bundle'a dahil etmeyin
- Server-only code'da kullanın
- Vercel environment variables kullanın
- .env.local dosyasını .gitignore'a ekleyin
- Secret rotation planı

## MongoDB Security

### Connection Security

- Connection string'de TLS/SSL kullanın
- IP whitelisting (MongoDB Atlas)
- Network access restriction
- Strong password for database user

### Data Access

- Least privilege principle
- Separate read/write users
- Never expose raw MongoDB errors to client
- Query optimization (no $where clauses)

## API Security

### Route Handlers

- CORS policy configuration
- Request size limits (20MB max)
- Response headers (security headers)
- Error handling (generic messages for client)

### Server Actions

- Input validation (Zod)
- Authorization checks
- Rate limiting
- Audit logging

## Dependencies

### Package Management

- Only install necessary dependencies
- Regular security audits: `npm audit`
- Prefer established packages
- Review package licenses
- Lock file commit (package-lock.json)

### Vulnerability Management

- Subscribe to security advisories
- Update dependencies regularly
- Test updates before deployment
- Keep Node.js version current

## Vercel Deployment Security

### Environment Variables

- Use Vercel dashboard for secrets
- Never commit .env files
- Separate production/staging environments
- Regional deployment consideration

### Edge Security

- Edge middleware for rate limiting
- Geographic restrictions (if needed)
- DDoS protection (Vercel built-in)

## Monitoring & Logging

### Security Events

- Failed login attempts
- Suspicious activity patterns
- Unauthorized access attempts
- Data modification logs

### Implementation

- Winston veya benzeri logger
- Structured logging
- Sensitive data never logged
- Log retention policy

## Incident Response

### Security Incident Procedure

1. Identify and contain
2. Notify stakeholders
3. Investigate root cause
4. Implement fixes
5. Monitor for recurrence
6. Document lessons learned

### Contact

Security issues için: [security-contact-email]

## Compliance

### GDPR/KVKK

- Explicit consent for cookies
- Data deletion functionality
- User data export
- Privacy policy accessible

### Data Protection

- Backup encryption
- Secure deletion
- Data retention policy
- User right to be forgotten

## Best Practices Summary

1. Never trust client input
2. Always validate server-side
3. Use HTTP-only cookies for auth
4. Sanitize all user-generated content
5. Implement rate limiting
6. Keep dependencies updated
7. Monitor security events
8. Follow principle of least privilege
9. Use secure communication (HTTPS)
10. Regular security audits

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [MongoDB Security](https://www.mongodb.com/docs/manual/security/)
- [ImageKit Security](https://docs.imagekit.io/security-features)
