# Architecture Overview

## High-Level Architecture

MSFL Tarih Kulübü Next.js rewrite'ı, modern full-stack web uygulaması mimarisini takip eder. Sistem, client-side rendering'den ziyade server-side rendering'i (SSR) ve server components'i tercih eder.

## Technology Stack

### Frontend
- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Rendering**: React Server Components (RSC) + Client Components (interactivity)
- **Image Optimization**: next/image (ImageKit integration)

### Backend
- **Runtime**: Node.js (Vercel serverless)
- **API**: Next.js Route Handlers + Server Actions
- **Database**: MongoDB (native driver)
- **Authentication**: JWT + HTTP-only cookies
- **File Storage**: ImageKit
- **Email**: SendGrid (service abstraction)

### Deployment
- **Platform**: Vercel
- **Environment**: Production/Staging/Development
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Speed Insights

## Folder Structure

```
msfl-tarih-kulubu-v2/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public route group
│   │   ├── page.tsx             # Home page
│   │   ├── hakkinda/            # About page
│   │   ├── etkinlikler/          # Events page
│   │   ├── tarihte-bugun/       # Tarihte Bugün page
│   │   └── blog/                # Blog routes
│   ├── (auth)/                  # Auth route group
│   │   ├── giris/               # Login
│   │   ├── kayit/               # Register
│   │   └── sifremi-unuttum/     # Password reset
│   ├── (account)/               # Account route group
│   │   └── hesap/               # Account settings
│   ├── (admin)/                 # Admin route group
│   │   └── admin/               # Admin panel
│   ├── u/[username]/            # Public profiles
│   ├── legal/                   # Legal pages
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components
│   ├── layout/                  # Layout components
│   ├── blog/                    # Blog-specific components
│   ├── auth/                    # Auth components
│   └── admin/                   # Admin components
├── lib/                         # Server-side utilities
│   ├── db/                      # Database layer
│   │   ├── connection.ts        # MongoDB connection
│   │   └── repositories/        # Data access layer
│   ├── auth/                    # Authentication logic
│   │   ├── session.ts           # Session management
│   │   ├── jwt.ts               # JWT utilities
│   │   └── middleware.ts        # Auth middleware
│   ├── validation/              # Schema validation
│   │   └── schemas.ts           # Zod schemas
│   ├── services/                # External services
│   │   ├── imagekit.ts          # ImageKit client
│   │   └── mail.ts              # Email service
│   └── utils/                   # General utilities
├── types/                       # TypeScript types
│   ├── user.ts
│   ├── post.ts
│   ├── comment.ts
│   └── index.ts
├── content/                     # Static content
│   ├── events.ts                # Event data
│   ├── tarihte-bugun.ts         # Historical events
│   └── about.ts                 # About content
├── public/                      # Static assets
│   ├── images/
│   └── fonts/
└── docs/                        # Documentation
```

## Key Architectural Decisions

### 1. Server-First Rendering

**Decision**: React Server Components ve Server Actions tercih edildi.

**Rationale**:
- Daha iyi SEO ve initial load performance
- Reduced client bundle size
- Direct database access (no API layer overhead)
- Better security (secrets not exposed to client)

**Trade-offs**:
- Client-side interactivity requires "use client" directive
- Some modern React features limited in RSC

### 2. MongoDB Native Driver

**Decision**: Mongoose yerine MongoDB native driver kullanılacak.

**Rationale**:
- Better serverless compatibility (no connection pooling overhead)
- Smaller bundle size
- More control over queries
- TypeScript-friendly

**Trade-offs**:
- No built-in validation (handled by Zod)
- Manual relationship management
- No schema migrations (handled manually)

### 3. HTTP-Only Cookies for Auth

**Decision**: JWT token'ları HTTP-only cookies'da saklanacak.

**Rationale**:
- XSS protection (cookies not accessible via JS)
- Automatic CSRF protection (SameSite attribute)
- Simpler state management
- Better security than localStorage

**Trade-offs**:
- CSRF still possible (need additional protection)
- Mobile app integration harder (web-only)

### 4. ImageKit for Media

**Decision**: Tüm media storage ImageKit üzerinden olacak.

**Rationale**:
- No local filesystem dependency (serverless-friendly)
- Built-in image optimization
- CDN delivery
- Existing integration from legacy system

**Trade-offs**:
- Vendor lock-in
- API limits and costs
- Requires internet connectivity

### 5. Service Abstraction for Email

**Decision**: Email gönderimi SendGrid ama abstraction layer üzerinden.

**Rationale**:
- Easy provider switching (SendGrid → Mailgun, etc.)
- Centralized email templates
- Testability (mock service in development)

**Trade-offs**:
- Additional abstraction layer
- Limited to single provider interface

## Data Flow

### Authentication Flow

```
Client → Next.js Route Handler → JWT Validation → MongoDB User Query → HTTP-Only Cookie
```

### Blog Creation Flow

```
Client Form → Server Action → Zod Validation → MongoDB Insert → ImageKit Upload → Response
```

### Public Blog Reading Flow

```
Client Request → Server Component → MongoDB Query → ImageKit CDN → Rendered HTML
```

## Security Layers

1. **Transport Layer**: HTTPS (Vercel automatic)
2. **Authentication**: JWT + HTTP-only cookies
3. **Authorization**: Role-based access control (RBAC)
4. **Input Validation**: Zod schemas
5. **Output Sanitization**: DOMPurify for user content
6. **CSRF Protection**: CSRF tokens for state-changing operations
7. **Rate Limiting**: API endpoint throttling
8. **File Upload**: ImageKit validation + size limits

## Performance Strategy

### Rendering
- Server Components for static content
- Client Components only for interactivity
- Dynamic imports for heavy components
- Streaming for slow data fetches

### Caching
- MongoDB connection caching (serverless)
- Static page generation where possible
- ImageKit CDN for media
- Vercel Edge Network for static assets

### Bundle Optimization
- Code splitting by route
- Tree shaking
- Dynamic imports
- Minimal client-side JavaScript

## Scalability Considerations

### Database
- Connection pooling for serverless
- Read replicas (if needed)
- Index optimization

### API
- Rate limiting
- Request throttling
- Edge functions for global distribution

### Media
- ImageKit CDN (global)
- Lazy loading
- Responsive images

## Migration Strategy

### Data Compatibility
- Preserve existing MongoDB collections
- Maintain bcrypt hash compatibility
- gradual schema migration (if needed)
- Backup before major changes

### URL Compatibility
- Redirect legacy routes to new routes
- Maintain SEO value
- Update internal links

### Feature Parity
- Phase-by-phase feature implementation
- Verify each feature against legacy system
- User testing before deployment

## Monitoring & Observability

### Production Monitoring
- Vercel Analytics
- Custom error logging
- Performance metrics
- Uptime monitoring

### Development Tools
- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting
- Local development database

## Future Considerations

### Potential Enhancements
- Real-time features (WebSocket/Server-Sent Events)
- Advanced search (Elasticsearch)
- Content management system
- Multi-language support
- PWA capabilities

### Technical Debt
- Test coverage improvement
- Documentation updates
- Code refactoring opportunities
- Performance optimization

---

This architecture prioritizes:
1. **Security**: Multiple layers of protection
2. **Performance**: Server-first rendering and optimization
3. **Scalability**: Serverless-compatible design
4. **Maintainability**: Clear separation of concerns
5. **Developer Experience**: TypeScript and modern tooling
