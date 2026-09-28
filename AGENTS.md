# MSFL Tarih Kulübü — Rewrite Instructions

## Mission

This branch is a full product rewrite of the existing MSFL History Club website.

Preserve the existing project's domain, public-facing content, and functional scope, but do NOT preserve its visual design, component structure, styling approach, route organization, or coding patterns.

The current production codebase is an Express + Handlebars + MongoDB monolith. Treat it as the functional/content reference only.

## Git

- All rewrite work belongs on the `rewrite/nextjs` branch.
- Never modify or reset `main`.
- Do not delete the legacy code from `main`.
- Make focused commits as the rewrite progresses.
- Before substantial changes, inspect the existing code and data model instead of guessing.

## Target stack

- Next.js 16.x App Router, TypeScript, React.
- Vercel as the deployment target.
- Tailwind CSS for styling, with a small reusable component system.
- Prefer React Server Components; use Client Components only for real browser interaction.
- MongoDB as the database.
- Prefer the native MongoDB driver/repository functions for the new data-access layer rather than porting the old Express/Mongoose structure verbatim.
- Zod (or an equivalent maintained schema validator) for server-side validation.
- Use secure HTTP-only cookies and a modern server-side authentication/session design. Existing bcrypt password hashes must remain usable so existing users do not need to recreate accounts unless a deliberate migration is required.
- Keep ImageKit for remote media storage. Never depend on local filesystem persistence in production.
- Keep the existing mail functionality concept for password reset/support workflows, but isolate provider-specific code behind a small service.
- Do not expose secrets or private credentials to client components.

## Design direction

Build a modern editorial / digital-archive experience for a school history club.

The new visual language must be recognizably different from the current site:
- Do not reuse the current full-screen background-image section structure.
- Do not reuse the current red/gray card language as the primary visual system.
- Do not reproduce the current navbar/footer composition.
- Do not port the existing CSS files or class names.
- Do not recreate the current alternating timeline as the central interaction pattern.
- Avoid inline styles.
- Use a coherent spacing, typography, color-token, radius, border, shadow, and motion system.
- The interface should feel like a contemporary digital humanities / museum publication rather than a generic school template.
- Prioritize strong typography, editorial grids, asymmetric composition where useful, restrained motion, excellent image treatment, and clear information hierarchy.
- Responsive behavior must be designed intentionally for mobile, tablet, and desktop rather than added as an afterthought.
- Accessibility matters: semantic HTML, visible focus states, keyboard support, sensible contrast, labelled controls, reduced-motion support.

## Content and functionality contract

The rewrite must preserve the existing domain scope:

### Public
- Home / club introduction
- Featured / recent history-club blog posts
- Blog list with pagination
- Blog detail pages with multi-image galleries
- Authenticated comments, comment editing/deletion
- Annual activity / event plan
- Club vision and mission
- Management / club team information
- “Tarihte Bugün” section
- Help & Support contact form
- Legal pages: explicit consent, privacy policy, terms of use, contact, sitemap
- Public profiles with social links, blog list, and comment list

### Authentication
- Registration
- Login
- Logout
- Password reset by email
- Account settings
- Profile data
- Avatar + cover image
- Social links
- Cookie/data-usage preferences
- Password change
- Account deletion

### Admin
- Dashboard statistics and recent activity
- User management, filtering, user detail
- Role management
- User deletion
- Blog management, filtering, edit/delete
- Comment moderation/edit/delete
- Support-message filtering and detail/status handling

## Data compatibility

Before changing schemas, inspect the existing models and collections.

The current logical entities are:
- User
- Post
- Comment
- SupportMessage
- Backup

Preserve existing MongoDB data compatibility wherever practical:
- Existing users and bcrypt password hashes should continue to work.
- Existing posts, comments, social fields, avatar/cover URLs, and role values must remain readable.
- Do not silently rename or discard existing fields.
- If a new schema is materially better, write a deliberate migration/compatibility layer rather than breaking old records.
- Do not expose or render unsanitized stored HTML. Existing post content may contain HTML, so sanitize it before rendering.

## Route / URL strategy

Use clean Next.js App Router URLs. Maintain compatibility with important existing URLs through redirects or route aliases where practical, especially old blog/profile/auth paths.

Preferred new structure can be:
- `/`
- `/blog`
- `/blog/[slug-or-id]`
- `/etkinlikler`
- `/hakkinda`
- `/tarihte-bugun`
- `/yardim-destek`
- `/giris`
- `/kayit`
- `/sifremi-unuttum`
- `/u/[username]`
- `/hesap/...`
- `/admin/...`

Use redirects for legacy paths rather than maintaining duplicate implementations.

## Content migration rules

The old repository is the source of truth for existing club content during the initial rewrite.

- Port existing meaningful text/content into clean typed content modules or database-backed data.
- Do not invent new historical claims merely to fill empty sections.
- Do not keep hard-coded database IDs embedded in the home page. Featured content should be queried or selected through configuration.
- Do not leave “temporary” lorem ipsum or fake statistics.
- Make annual plans and “Tarihte Bugün” data-driven.
- Remove obsolete/debug-only routes and duplicated legacy implementations.

## Architecture expectations

Prefer a clear structure such as:

- `app/` for routes and layouts
- `components/` for reusable UI
- `lib/db/` for database connection and repositories
- `lib/auth/` for authentication/session logic
- `lib/validation/` for schemas
- `lib/services/` for ImageKit/mail/etc.
- `content/` for static club/editorial content
- `types/` for shared domain types

Do not create a giant page component. Keep server mutations close to their domain and use Server Actions or Route Handlers where appropriate.

## Performance / Vercel

The application must be deployable directly as a Next.js application on Vercel.

- No custom long-running Express server.
- No reliance on local disk persistence.
- Cache or reuse MongoDB connections correctly in serverless execution.
- Use `next/image` for appropriate remote images.
- Use metadata, sitemap, robots, and sensible Open Graph metadata.
- Avoid shipping large client bundles when Server Components can handle the job.
- Build and test locally before considering a feature complete.

## Verification

After meaningful changes:
1. Run the project's typecheck/lint/build commands.
2. Fix all build/type errors.
3. Verify authentication, blog CRUD, comments, media upload flow, profiles, account settings, and admin permissions.
4. Test both mobile and desktop layouts.
5. Check that old database records render correctly.
6. Check that no secret/env value is included in client bundles.
7. Do not declare the rewrite complete while known broken routes or placeholder functionality remain.

## Important

The goal is not to “modernize the old Handlebars site.”

The goal is to build a new Next.js product whose subject matter and capabilities come from the existing site, while the UI, information architecture, component model, styling system, data-access architecture, and implementation style are substantially different.
