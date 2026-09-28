# Legacy Audit

## Overview

Bu doküman, mevcut Express + Handlebars + MongoDB monolith sisteminin detaylı teknik audit'ini içerir. Audit, rewrite sürecinde neyin korunacağını, neyin yeniden yazılacağını ve riskli alanları belirler.

## Current System Analysis

### Technology Stack

**Backend**:
- Framework: Express.js 5.1.0
- Template Engine: Handlebars (express-handlebars 8.0.3)
- Database: MongoDB (Mongoose 8.19.3)
- Authentication: JWT + HTTP-only cookies
- File Storage: ImageKit (imagekit 6.0.0, @imagekit/nodejs 7.1.1)
- Email: SendGrid (@sendgrid/mail 8.1.6)
- Validation: express-validator 7.3.0
- Security: helmet 8.1.0, csurf 1.2.2, express-rate-limit 8.2.1

**Frontend**:
- CSS: Custom CSS (inline styles + separate CSS files)
- JavaScript: Vanilla JS + jQuery-like patterns
- Icons: Font Awesome
- Responsive: Media queries
- No framework

**Deployment**:
- Platform: Vercel
- Environment: Production
- Analytics: Vercel Analytics, Speed Insights

## File Structure Analysis

### ✅ Preserve (Functional Reference)

**Models** (`models/`):
- `User.js` - User schema with bcrypt passwords
- `Post.js` - Blog post schema with ImageKit images
- `Comment.js` - Comment schema
- `SupportMessage.js` - Support messages schema
- `Backup.js` - User backup schema

**Routes** (`routes/`):
- `main.js` - Public routes (home, about, events, tarihteBugun, blog list)
- `blog.js` - Blog CRUD, comments
- `kullanici.js` - Auth (register, login, logout)
- `sifreUnuttum.js` - Password reset
- `hesap.js` - Account settings, profile management
- `profile.js` - Public profiles
- `publicProfile.js` - User profiles (@username routes)
- `admin.js` - Admin panel
- `yardimDestek.js` - Support form
- `legal.js` - Legal pages
- `upload.js` - Image upload routes
- `profileMedia.js` - Profile media upload

**Middlewares** (`middlewares/`):
- `jwtAuth.js` - JWT authentication
- `auth.js` - Route protection
- `csrf.js` - CSRF protection
- `rateLimiter.js` - Rate limiting
- `validators.js` - Input validation
- `sanitize.js` - Input sanitization

**Helpers** (`helpers/`):
- `imagekit.js` - ImageKit client
- `mail.js` - SendGrid email service
- `mailTemplates.js` - Email templates
- `sanitize.js` - HTML sanitization
- `logger.js` - Logging utility

### ❌ Rewrite (Complete Rewrite)

**Views** (`views/`):
- `layouts/main.handlebars` - Main layout
- `layouts/admin.handlebars` - Admin layout
- `pages/*.handlebars` - All page templates
- `partials/*.handlebars` - Reusable components

**Public Assets** (`public/`):
- `css/` - Custom CSS files
- `js/` - Custom JavaScript files
- `img/` - Static images
- `fonts/` - Custom fonts

**Server Configuration**:
- `app.js` - Express app configuration
- `server_local.js` - Local server
- `vercel.json` - Vercel configuration

### ⚠️ Archive (Reference Only)

**Archive** (`archive/`):
- Old JavaScript files
- Legacy configurations
- Deprecated features

## Functional Analysis

### Authentication System

**Current Implementation**:
- JWT tokens stored in HTTP-only cookies
- 7-day expiration for users
- bcrypt password hashing (cost: 10)
- Role-based access (user, admin)
- Admin secret token for admin login

**Assessment**:
- ✅ Secure (HTTP-only cookies)
- ✅ Bcrypt compatible (preserve hashes)
- ⚠️ JWT secret hardcoded in some places
- ⚠️ Admin token validation simplistic

**Migration Strategy**:
- Preserve bcrypt hashes
- Improve JWT secret management
- Enhance admin authentication
- Keep HTTP-only cookie approach

### Blog System

**Current Implementation**:
- Mongoose Post model with ImageKit images
- Pagination (12 items per page)
- Multi-image gallery support
- Comment system (authenticated)
- Edit/delete permissions (owner/admin)
- ImageKit integration for upload/delete

**Assessment**:
- ✅ Good data model
- ✅ ImageKit integration works
- ⚠️ Hard-coded blog IDs in home page
- ⚠️ No search functionality
- ⚠️ No tagging/categorization

**Migration Strategy**:
- Preserve Post model structure
- Remove hard-coded IDs
- Add search functionality
- Keep ImageKit integration
- Improve pagination

### Comment System

**Current Implementation**:
- Mongoose Comment model
- Authenticated comments only
- Edit/delete (owner/admin)
- No nested comments

**Assessment**:
- ✅ Simple and functional
- ⚠️ No nested/threaded comments
- ⚠️ No comment moderation queue

**Migration Strategy**:
- Preserve Comment model
- Keep edit/delete functionality
- Consider nested comments (future)
- Keep moderation approach

### User System

**Current Implementation**:
- Mongoose User model
- Profile data (avatar, cover, bio, social)
- Cookie/data-usage preferences
- Account deletion with backup
- Public profiles (@username routes)

**Assessment**:
- ✅ Comprehensive profile system
- ✅ Backup on deletion
- ⚠️ Username change updates all posts
- ⚠️ No email verification
- ⚠️ No 2FA

**Migration Strategy**:
- Preserve User model
- Keep backup system
- Improve username change handling
- Add email verification (future)
- Keep profile structure

### Admin Panel

**Current Implementation**:
- Separate admin layout
- Dashboard with statistics
- User management (list, detail, role change, delete)
- Blog management (list, edit, delete)
- Comment moderation (list, edit, delete)
- Support message handling
- Admin secret token authentication

**Assessment**:
- ✅ Comprehensive admin features
- ✅ Good filtering and search
- ⚠️ Separate admin route (/admin)
- ⚠️ Admin token simplistic
- ⚠️ No audit logging

**Migration Strategy**:
- Preserve admin functionality
- Improve admin authentication
- Add audit logging
- Keep filtering/search features
- Unify with main app structure

### Support System

**Current Implementation**:
- SupportMessage model
- Public form (authenticated/unauthenticated)
- Admin panel for viewing and status
- Auto status change (new → read)

**Assessment**:
- ✅ Simple and functional
- ⚠️ No email notifications
- ⚠️ No canned responses

**Migration Strategy**:
- Preserve SupportMessage model
- Keep public form
- Add email notifications (future)
- Keep admin handling

### Legal Pages

**Current Implementation**:
- Static Handlebars templates
- Pages: acik-riza, gizlilik, kullanim-sartlari, iletisim, site-haritasi

**Assessment**:
- ✅ Complete legal coverage
- ⚠️ Hard-coded content
- ⚠️ No versioning

**Migration Strategy**:
- Convert to React components
- Make content data-driven
- Keep legal structure

## Technical Debt & Issues

### Security Issues

1. **JWT Secret Management**
   - Issue: JWT secrets sometimes hardcoded
   - Risk: Token compromise
   - Priority: High
   - Fix: Environment variables

2. **Admin Token**
   - Issue: Simple secret token for admin login
   - Risk: Admin account compromise
   - Priority: High
   - Fix: Enhanced admin authentication

3. **CSRF Protection**
   - Issue: CSRF middleware not applied to all routes
   - Risk: CSRF attacks
   - Priority: Medium
   - Fix: Apply CSRF consistently

4. **Input Sanitization**
   - Issue: HTML content not always sanitized
   - Risk: XSS attacks
   - Priority: High
   - Fix: DOMPurify integration

### Performance Issues

1. **MongoDB Connection**
   - Issue: Connection caching but not optimized for serverless
   - Risk: Cold start delays
   - Priority: Medium
   - Fix: Serverless-optimized connection pooling

2. **Hard-coded Content**
   - Issue: Blog IDs, content hard-coded in templates
   - Risk: Maintenance issues
   - Priority: Medium
   - Fix: Data-driven content

3. **No Caching**
   - Issue: No response caching
   - Risk: Slow page loads
   - Priority: Low
   - Fix: Implement caching strategy

### Code Quality Issues

1. **Duplicate Code**
   - Issue: Similar patterns in routes
   - Risk: Maintenance burden
   - Priority: Low
   - Fix: Extract common patterns

2. **Error Handling**
   - Issue: Inconsistent error handling
   - Risk: Poor user experience
   - Priority: Medium
   - Fix: Standardize error handling

3. **Validation**
   - Issue: express-validator inconsistent
   - Risk: Invalid data
   - Priority: Medium
   - Fix: Centralized Zod validation

### Architecture Issues

1. **Monolithic Structure**
   - Issue: Single Express app handles everything
   - Risk: Hard to scale
   - Priority: Low
   - Fix: Next.js modular structure

2. **No API Layer**
   - Issue: No separate API
   - Risk: Hard to extend
   - Priority: Low
   - Fix: Next.js API routes

3. **No TypeScript**
   - Issue: No type safety
   - Risk: Runtime errors
   - Priority: Medium
   - Fix: Full TypeScript migration

## Data Model Analysis

### User Model

**Fields**:
- ✅ username (unique, required)
- ✅ email (unique, required)
- ✅ password (bcrypt, required)
- ✅ name, surname (required)
- ✅ role (default: "user")
- ✅ date (registration date)
- ✅ avatar (ImageKit: url, fileId, provider)
- ✅ coverImage (ImageKit: url, fileId, provider)
- ✅ social (instagram, x, github, youtube, website)
- ✅ bio
- ✅ analyticsCookies, personalizationCookies, serviceDataUsage, personalizedContent
- ✅ resetCode, resetCodeExpires

**Issues**:
- ⚠️ No email verification status
- ⚠️ No last login tracking
- ⚠️ No account status (active/suspended)

**Migration Strategy**:
- Preserve all existing fields
- Add email verification (optional)
- Add last login tracking (optional)
- Keep cookie preferences

### Post Model

**Fields**:
- ✅ user_id (reference to User)
- ✅ username (denormalized)
- ✅ title (required)
- ✅ content (required, HTML)
- ✅ images (ImageKit array: url, fileId, provider)
- ✅ date

**Issues**:
- ⚠️ No slug/URL-friendly ID
- ⚠️ No tags/categories
- ⚠️ No published/draft status
- ⚠️ No featured flag
- ⚠️ HTML content needs sanitization

**Migration Strategy**:
- Preserve existing structure
- Add slug generation (optional)
- Keep ImageKit images structure
- Sanitize HTML content on render
- Add featured flag (optional)

### Comment Model

**Fields**:
- ✅ post_id (reference to Post)
- ✅ user_id (reference to User)
- ✅ username (denormalized)
- ✅ content (required)
- ✅ date

**Issues**:
- ⚠️ No parent comment (nested comments)
- ⚠️ No edit history
- ⚠️ No status (approved/hidden)

**Migration Strategy**:
- Preserve existing structure
- Keep flat comment structure
- Add nested support (future)
- Keep edit/delete functionality

### SupportMessage Model

**Fields**:
- ✅ name
- ✅ email (required)
- ✅ topic (default: "Diğer")
- ✅ message (required)
- ✅ user_id (reference to User, optional)
- ✅ status (default: "new")
- ✅ createdAt, updatedAt (timestamps)

**Issues**:
- None significant

**Migration Strategy**:
- Preserve existing structure
- Keep status workflow
- Add email notifications (future)

### Backup Model

**Fields**:
- ✅ userId
- ✅ username
- ✅ email
- ✅ deletedAt
- ✅ ipHistory
- ✅ loginHistory
- ✅ deviceInfo
- ✅ userData (profile, posts, comments)

**Issues**:
- ⚠️ No expiration/cleanup
- ⚠️ No restore functionality

**Migration Strategy**:
- Preserve existing structure
- Keep backup on deletion
- Add restore functionality (future)
- Add cleanup policy (future)

## Route Analysis

### Public Routes

| Legacy Route | New Route | Notes |
|-------------|-----------|-------|
| `/` | `/` | Home page |
| `/hakkinda` | `/hakkinda` | About page |
| `/etkinlikler` | `/etkinlikler` | Events page |
| `/tarihteBugun` | `/tarihte-bugun` | Historical events |
| `/blog` | `/blog` | Blog list |
| `/blog/:id` | `/blog/[id]` | Blog detail |
| `/yardim-destek` | `/yardim-destek` | Support form |
| `/legal/*` | `/legal/*` | Legal pages |

### Auth Routes

| Legacy Route | New Route | Notes |
|-------------|-----------|-------|
| `/kullanici/kayitOl` | `/kayit` | Register |
| `/kullanici/oturumAc` | `/giris` | Login |
| `/kullanici/cikis` | `/cikis` | Logout |
| `/sifre-unuttum` | `/sifremi-unuttum` | Password reset |

### Account Routes

| Legacy Route | New Route | Notes |
|-------------|-----------|-------|
| `/hesap` | `/hesap` | Account settings |
| `/profile` | `/profil` | Profile editing |
| `/profile/@:username` | `/u/[username]` | Public profile |

### Admin Routes

| Legacy Route | New Route | Notes |
|-------------|-----------|-------|
| `/admin` | `/admin` | Admin panel |
| `/admin/dashboard` | `/admin/dashboard` | Dashboard |
| `/admin/kullanicilar` | `/admin/kullanicilar` | User management |
| `/admin/bloglar` | `/admin/bloglar` | Blog management |
| `/admin/yorumlar` | `/admin/yorumlar` | Comment moderation |
| `/admin/destek` | `/admin/destek` | Support messages |

## Risk Assessment

### High Risk Items

1. **Data Loss During Migration**
   - Risk: User passwords, blog content, comments
   - Mitigation: Full backup before migration
   - Priority: Critical

2. **Authentication Breakage**
   - Risk: Users cannot login after migration
   - Mitigation: Preserve bcrypt hashes, test thoroughly
   - Priority: Critical

3. **ImageKit API Issues**
   - Risk: Uploaded images not accessible
   - Mitigation: Test ImageKit integration early
   - Priority: High

### Medium Risk Items

1. **URL Breaking**
   - Risk: Old URLs not redirecting
   - Mitigation: Implement redirect strategy
   - Priority: Medium

2. **SEO Impact**
   - Risk: Search engine rankings drop
   - Mitigation: Preserve URLs, implement redirects
   - Priority: Medium

3. **Performance Regression**
   - Risk: New system slower than legacy
   - Mitigation: Performance testing, optimization
   - Priority: Medium

### Low Risk Items

1. **UI/UX Changes**
   - Risk: Users confused by new interface
   - Mitigation: Gradual rollout, user feedback
   - Priority: Low

2. **Feature Gaps**
   - Risk: Missing features from legacy
   - Mitigation: Feature parity checklist
   - Priority: Low

## Recommendations

### Immediate Actions (Before Rewrite)

1. **Full Database Backup**
   - Export all collections
   - Verify backup integrity
   - Store in secure location

2. **Environment Variable Audit**
   - Document all required variables
   - Ensure none are hardcoded
   - Test in development

3. **Security Audit**
   - Review authentication flow
   - Check for hardcoded secrets
   - Test authorization logic

### During Rewrite

1. **Incremental Migration**
   - Migrate feature by feature
   - Test each feature thoroughly
   - Keep legacy system running

2. **Data Compatibility**
   - Preserve bcrypt hashes
   - Keep database schema compatible
   - Test with real data

3. **Performance Monitoring**
   - Monitor build times
   - Track page load times
   - Optimize as needed

### After Rewrite

1. **Comprehensive Testing**
   - Test all user flows
   - Verify data integrity
   - Check security measures

2. **User Acceptance Testing**
   - Get feedback from users
   - Fix critical issues
   - Rollback plan ready

3. **Monitoring Setup**
   - Set up error tracking
   - Monitor performance
   - Track user behavior

## Conclusion

The legacy system is functional but has technical debt and security concerns. The rewrite should:

1. **Preserve**: Data models, authentication approach, ImageKit integration
2. **Improve**: Security, performance, code quality, user experience
3. **Modernize**: Framework, language, deployment, architecture
4. **Maintain**: Feature parity, data compatibility, URL structure

The migration strategy should be incremental, with thorough testing at each phase to minimize risk.
