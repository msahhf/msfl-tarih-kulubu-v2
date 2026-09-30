# Database Compatibility

## Overview

Bu doküman, mevcut MongoDB veri modellerinin Next.js rewrite'ı ile uyumluluğunu detaylandırır. Mevcut production verilerinin kaybolmaması için kritik öneme sahiptir.

## Implementation Status

**Phase 3 — Database Compatibility**: ✅ **COMPLETED**

### Implemented Components

- ✅ TypeScript domain types (`types/user.ts`, `types/post.ts`, `types/comment.ts`, `types/support-message.ts`, `types/backup.ts`)
- ✅ MongoDB connection layer with serverless-safe pooling (`lib/db/mongodb.ts`)
- ✅ ObjectId handling strategy (`lib/db/object-id.ts`)
- ✅ Repository layer for all collections (`lib/db/repositories/`)
- ✅ Bcrypt compatibility layer (`lib/auth/bcrypt.ts`)
- ✅ Date normalization utilities (`lib/db/date-utils.ts`)
- ✅ Index recommendations documentation (`docs/migration/index-recommendations.md`)
- ✅ Index setup script (`scripts/setup-indexes.ts`)
- ✅ Unit tests for repository layer (`lib/db/test-repositories.test.ts`)
- ✅ Bcrypt compatibility test (`lib/db/test-bcrypt.ts`)

### Test Results

**Bcrypt Compatibility Test**: ✅ PASSED
- Hash passwords with cost factor 10
- Verify passwords against hashes
- Reject incorrect passwords

**Repository Layer Tests**: ✅ PASSED
- ObjectId handling
- Legacy field compatibility
- Optional/null field handling
- Date handling

**Note**: Production verification still requires checking against actual production database hashes.

## MongoDB Collections

### Users Collection

#### Legacy Schema (Mongoose)

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (required, bcrypt hash),
  name: String (required),
  surname: String (required),
  role: String (default: "user"),
  date: Date (default: Date.now),
  
  avatar: {
    url: String (default: ""),
    fileId: String (default: ""),
    provider: String (default: "imagekit")
  },
  
  coverImage: {
    url: String (default: ""),
    fileId: String (default: ""),
    provider: String (default: "imagekit")
  },
  
  social: {
    instagram: String (default: ""),
    x: String (default: ""),
    github: String (default: ""),
    youtube: String (default: ""),
    website: String (default: "")
  },
  
  bio: String (default: ""),
  
  analyticsCookies: Boolean (default: false),
  personalizationCookies: Boolean (default: false),
  serviceDataUsage: Boolean (default: false),
  personalizedContent: Boolean (default: false),
  
  resetCode: String (default: null),
  resetCodeExpires: Date (default: null)
}
```

#### Implemented TypeScript Interface

```typescript
// types/user.ts
interface User {
  _id: string;
  username: string;
  email: string;
  password: string; // bcrypt hash
  name: string;
  surname: string;
  role: string;
  date: Date;
  
  avatar: MediaInfo;
  coverImage: MediaInfo;
  social: SocialLinks;
  bio: string;
  
  analyticsCookies: boolean;
  personalizationCookies: boolean;
  serviceDataUsage: boolean;
  personalizedContent: boolean;
  
  resetCode: string | null;
  resetCodeExpires: Date | null;
}

interface MediaInfo {
  url: string;
  fileId: string;
  provider: string;
}

interface SocialLinks {
  instagram: string;
  x: string;
  github: string;
  youtube: string;
  website: string;
}
```

#### Repository Functions

```typescript
// lib/db/repositories/user.repository.ts
- findById(id: string): Promise<User | null>
- findByUsername(username: string): Promise<User | null>
- findByEmail(email: string): Promise<User | null>
- createUser(input: CreateUserInput): Promise<User>
- updateUser(id: string, input: UpdateUserInput): Promise<User | null>
- setPasswordReset(id: string, input: PasswordResetInput): Promise<User | null>
- clearPasswordReset(id: string): Promise<User | null>
- deleteUser(id: string): Promise<boolean>
- countUsers(): Promise<number>
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields preserved in TypeScript interface
- Bcrypt password hashes compatible (cost factor 10)
- ImageKit structure unchanged
- Social media fields unchanged
- Cookie preferences unchanged

**Implementation Details**:
- Using `bcryptjs` (pure JavaScript) for better cross-platform compatibility
- Same cost factor (10) as legacy system
- ObjectId ↔ string conversion at repository boundaries
- Serverless-safe MongoDB connection pooling

**Bcrypt Compatibility**:
```typescript
// lib/auth/bcrypt.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**Critical**: Never re-hash existing passwords. They must continue to work.

### Posts Collection

#### Legacy Schema (Mongoose)

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User, required),
  username: String (denormalized),
  title: String (required),
  content: String (required, HTML),
  images: [
    {
      url: String,
      fileId: String,
      provider: String (enum: ["imagekit"], default: "imagekit")
    }
  ],
  date: Date (default: Date.now)
}
```

#### Implemented TypeScript Interface

```typescript
// types/post.ts
interface Post {
  _id: string;
  user_id: string; // ObjectId as string
  username: string; // denormalized
  title: string;
  content: string; // HTML content
  images: MediaInfo[];
  date: Date;
}

interface MediaInfo {
  url: string;
  fileId: string;
  provider: string;
}
```

#### Repository Functions

```typescript
// lib/db/repositories/post.repository.ts
- findById(id: string): Promise<Post | null>
- findRecent(limit: number): Promise<Post[]>
- findPaginated(page: number, pageSize: number): Promise<{ posts: Post[]; total: number; pages: number }>
- findByUserId(userId: string): Promise<Post[]>
- createPost(input: CreatePostInput): Promise<Post>
- updatePost(id: string, input: UpdatePostInput): Promise<Post | null>
- deletePost(id: string): Promise<boolean>
- countPosts(): Promise<number>
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields preserved in TypeScript interface
- ImageKit structure unchanged
- HTML content preserved (sanitization to be added in rendering layer)
- Denormalized username preserved

**Implementation Details**:
- Pagination support built into repository
- Date sorting for recent posts
- User-specific post queries

**HTML Content Sanitization**:
```typescript
// To be implemented in rendering layer (Phase 5)
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(post.content);
```

**Critical**: HTML content may contain malicious scripts. Always sanitize before rendering.

### Comments Collection

#### Legacy Schema (Mongoose)

```javascript
{
  _id: ObjectId,
  post_id: ObjectId (ref: Post, required),
  user_id: ObjectId (ref: User, required),
  username: String (required),
  content: String (required),
  date: Date (default: Date.now)
}
```

#### Implemented TypeScript Interface

```typescript
// types/comment.ts
interface Comment {
  _id: string;
  post_id: string; // ObjectId as string
  user_id: string; // ObjectId as string
  username: string;
  content: string;
  date: Date;
}
```

#### Repository Functions

```typescript
// lib/db/repositories/comment.repository.ts
- findById(id: string): Promise<Comment | null>
- findByPostId(postId: string): Promise<Comment[]>
- findByUserId(userId: string): Promise<Comment[]>
- createComment(input: CreateCommentInput): Promise<Comment>
- updateComment(id: string, input: UpdateCommentInput): Promise<Comment | null>
- deleteComment(id: string): Promise<boolean>
- deleteCommentsByPostId(postId: string): Promise<number>
- countComments(): Promise<number>
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields preserved in TypeScript interface
- Denormalized username preserved
- Flat comment structure preserved

**Implementation Details**:
- Cascade delete support (delete comments when post deleted)
- Date sorting for chronological display
- User-specific comment history queries

**Critical**: Do not implement nested comments in initial rewrite. Keep flat structure.

### SupportMessage Collection

#### Legacy Schema (Mongoose)

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (required),
  topic: String (default: "Diğer"),
  message: String (required),
  user_id: ObjectId (ref: User, default: null),
  status: String (default: "new"),
  createdAt: Date,
  updatedAt: Date
}
```

#### Implemented TypeScript Interface

```typescript
// types/support-message.ts
interface SupportMessage {
  _id: string;
  name: string | null;
  email: string;
  topic: string;
  message: string;
  user_id: string | null; // ObjectId as string
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Repository Functions

```typescript
// lib/db/repositories/support-message.repository.ts
- findById(id: string): Promise<SupportMessage | null>
- findFiltered(filters: { status?: string; email?: string }): Promise<SupportMessage[]>
- createMessage(input: CreateSupportMessageInput): Promise<SupportMessage>
- updateStatus(id: string, input: UpdateSupportMessageInput): Promise<SupportMessage | null>
- deleteMessage(id: string): Promise<boolean>
- countMessages(filters?: { status?: string }): Promise<number>
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields preserved in TypeScript interface
- Status workflow preserved
- Timestamps preserved

**Implementation Details**:
- Filter support for admin panel (by status, email)
- Status update with automatic updatedAt timestamp
- Count queries for admin dashboard

**Critical**: Status values must be compatible with existing admin panel.

### Backup Collection

#### Legacy Schema (Mongoose)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required),
  username: String,
  email: String,
  deletedAt: Date (default: Date.now),
  
  ipHistory: [String],
  loginHistory: [Object],
  deviceInfo: [Object],
  
  userData: {
    profile: Object, // Complete User model
    posts: Array,
    comments: Array
  }
}
```

#### Implemented TypeScript Interface

```typescript
// types/backup.ts
interface Backup {
  _id: string;
  userId: string; // ObjectId as string
  username: string | null;
  email: string | null;
  deletedAt: Date;
  
  ipHistory: string[];
  loginHistory: object[];
  deviceInfo: object[];
  
  userData: UserData;
}

interface UserData {
  profile: object;
  posts: object[];
  comments: object[];
}
```

#### Repository Functions

```typescript
// lib/db/repositories/backup.repository.ts
- findById(id: string): Promise<Backup | null>
- findByUserId(userId: string): Promise<Backup[]>
- createBackup(input: CreateBackupInput): Promise<Backup>
- deleteBackup(id: string): Promise<boolean>
- countBackups(): Promise<number>
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields preserved in TypeScript interface
- Backup structure unchanged
- User data structure preserved as objects for flexibility

**Implementation Details**:
- User backup history queries
- Date sorting for most recent backups
- Flexible object storage for user data

**Critical**: Backup system must work exactly as legacy. No data loss on account deletion.

## Index Strategy

### Current Indexes (From Legacy Mongoose)

```javascript
// Users (enforced by Mongoose unique constraints)
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Posts (inferred from usage)
db.posts.createIndex({ user_id: 1 });
db.posts.createIndex({ date: -1 });

// Comments (inferred from usage)
db.comments.createIndex({ post_id: 1 });
db.comments.createIndex({ user_id: 1 });
db.comments.createIndex({ date: -1 });

// SupportMessage (inferred from usage)
db.supportmessages.createIndex({ status: 1 });
db.supportmessages.createIndex({ createdAt: -1 });
db.supportmessages.createIndex({ email: 1 });

// Backup (inferred from usage)
db.backups.createIndex({ userId: 1 });
db.backups.createIndex({ deletedAt: -1 });
```

### Implemented Index Recommendations

**Documentation**: `docs/migration/index-recommendations.md`

**Setup Script**: `scripts/setup-indexes.ts`

**Recommended Indexes**:
```javascript
// Comments (high priority - very frequent queries)
db.comments.createIndex({ post_id: 1, date: 1 }, { background: true });
db.comments.createIndex({ user_id: 1, date: -1 }, { background: true });

// Posts (medium priority - date sorting benefits)
db.posts.createIndex({ date: -1 }, { background: true });
db.posts.createIndex({ user_id: 1, date: -1 }, { background: true });

// SupportMessage (low priority - admin-only)
db.supportmessages.createIndex({ status: 1, createdAt: -1 }, { background: true });
db.supportmessages.createIndex({ email: 1 }, { background: true });

// Backup (low priority - infrequent)
db.backups.createIndex({ userId: 1, deletedAt: -1 }, { background: true });
```

**Important**:
- Index creation is NOT automatic
- Run manually after review: `npx tsx scripts/setup-indexes.ts`
- Use `background: true` for large collections
- Test on staging environment first

## ObjectId Handling Strategy

### Implemented Strategy

**Documentation**: `lib/db/object-id.ts`

**Strategy**: Use strings throughout the application, convert to ObjectId only at database boundaries.

**Rationale**:
- Strings are easier to work with in URLs, forms, and APIs
- ObjectId conversion happens only in repository layer
- Reduces type conversion complexity in business logic
- Compatible with JSON serialization

**Rules**:
- All public APIs use string IDs
- Repository layer converts string → ObjectId for queries
- Repository layer converts ObjectId → string for responses
- Never expose ObjectId to client components

**Implementation**:
```typescript
// lib/db/object-id.ts
export function isValidObjectId(id: string): boolean {
  try {
    return ObjectId.isValid(id);
  } catch {
    return false;
  }
}

export function toObjectId(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id);
}

export function toStringId(id: ObjectId | string): string {
  if (typeof id === "string") {
    return id;
  }
  return id.toString();
}
```

**Usage in Repositories**:
```typescript
// Convert string to ObjectId for queries
const document = await collection.findOne({ _id: toObjectId(id) });

// Convert ObjectId to string for responses
return document._id.toString();
```

## Data Migration Strategy

### Phase 1: No Schema Changes (Initial Rewrite)

**Approach**: Use existing schema as-is

**Benefits**:
- Zero data migration risk
- Immediate compatibility
- Fast implementation

**Implementation**:
```typescript
// Use MongoDB native driver
// Map documents to TypeScript interfaces
// No schema changes
```

### Phase 2: Gradual Enhancement (Future)

**Approach**: Add optional fields with defaults

**Benefits**:
- Backward compatible
- Incremental improvements
- No breaking changes

**Implementation**:
```typescript
// Add new fields with default values
// Existing records unaffected
// New records use enhanced schema
```

### Phase 3: Schema Migration (Optional Future)

**Approach**: Data migration script if needed

**Benefits**:
- Clean schema
- Better performance
- Modern structure

**Implementation**:
```typescript
// Migration script
// 1. Backup data
// 2. Transform data
// 3. Update schema
// 4. Verify integrity
```

## Bcrypt Password Hash Compatibility

### Legacy Implementation

```javascript
// Legacy bcrypt hashing
const hashed = await bcrypt.hash(password, 10);
```

### New Implementation

```typescript
// Compatible bcrypt hashing
import bcrypt from 'bcrypt';

// Verify existing password (cost 10)
const isValid = await bcrypt.compare(plainPassword, user.password);

// Hash new password (cost 10-12, compatible)
const hashedPassword = await bcrypt.hash(plainPassword, 10);
```

### Compatibility Matrix

| Legacy Cost | New Cost | Compatible |
|-------------|----------|------------|
| 10 | 10 | ✅ Yes |
| 10 | 11 | ✅ Yes |
| 10 | 12 | ✅ Yes |

**Critical**: New system must support cost 10-12 to maintain compatibility.

## ImageKit Integration Compatibility

### Legacy Image Structure

```javascript
{
  url: "https://ik.imagekit.io/...",
  fileId: "file_id_123",
  provider: "imagekit"
}
```

### New Image Structure

```typescript
{
  url: string;
  fileId: string;
  provider: 'imagekit';
}
```

### Compatibility Notes

**✅ Preserve**:
- ImageKit URL format
- File ID format
- Provider field value

**Migration**:
- No changes needed
- Existing images will work
- New images use same structure

## Data Validation Strategy

### Legacy Validation (express-validator)

```javascript
// Legacy validation
req.checkBody('username').isLength({ min: 3, max: 20 });
req.checkBody('email').isEmail();
```

### New Validation (Zod)

```typescript
// New validation
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  // ... other fields
});
```

### Compatibility Notes

**✅ Maintain Rules**:
- Same validation rules
- Same error messages
- Same field constraints

**Enhancement**:
- Better type safety
- More descriptive errors
- Easier maintenance

## Rollback Strategy

### Pre-Migration Backup

```bash
# Export all collections
mongodump --uri="MONGO_URL" --out=./backup

# Verify backup
ls -la ./backup
```

### Rollback Procedure

```bash
# If migration fails
mongorestore --uri="MONGO_URL" --drop ./backup

# Verify data integrity
mongosh --uri="MONGO_URL" --eval "db.users.countDocuments()"
```

### Migration Testing

```typescript
// Test migration in development
1. Backup production data
2. Restore to development
3. Run migration script
4. Verify data integrity
5. Test authentication
6. Test blog functionality
7. Test admin operations
```

## Verification Checklist

### Data Integrity

- [ ] All users preserved
- [ ] All posts preserved
- [ ] All comments preserved
- [ ] All support messages preserved
- [ ] All backups preserved

### Authentication

- [ ] Existing users can login
- [ ] Bcrypt hashes work
- [ ] Session management works
- [ ] Password reset works

### Content

- [ ] All blogs render correctly
- [ ] All images load from ImageKit
- [ ] All comments display correctly
- [ ] HTML content sanitized

### Admin

- [ ] User management works
- [ ] Blog management works
- [ ] Comment moderation works
- [ ] Support messages work

## Risk Mitigation

### High Risk: Data Loss

**Mitigation**:
- Full backup before any changes
- Test migration in development
- Rollback plan ready
- Monitor data integrity

### Medium Risk: Authentication Breakage

**Mitigation**:
- Preserve bcrypt hashes
- Test with real user accounts
- Keep legacy system running
- Gradual rollout

### Low Risk: Performance Regression

**Mitigation**:
- Monitor query performance
- Optimize indexes
- Use connection pooling
- Implement caching

## Conclusion

The database compatibility strategy prioritizes:

1. **Zero Data Loss**: Full backup and rollback plan
2. **Backward Compatibility**: Preserve existing schema
3. **Gradual Enhancement**: Add features incrementally
4. **Thorough Testing**: Verify all functionality
5. **Rollback Ready**: Quick recovery if needed

The new system will work with existing MongoDB data without requiring immediate schema changes. Future enhancements can be added incrementally with backward compatibility in mind.

---

## Phase 3 Implementation Summary

### Completed Tasks

**TypeScript Domain Types**:
- ✅ `types/user.ts` - User interface with all legacy fields
- ✅ `types/post.ts` - Post interface with MediaInfo
- ✅ `types/comment.ts` - Comment interface
- ✅ `types/support-message.ts` - SupportMessage interface
- ✅ `types/backup.ts` - Backup interface with UserData
- ✅ `types/index.ts` - Central exports

**Database Layer**:
- ✅ `lib/db/mongodb.ts` - Serverless-safe MongoDB connection with pooling
- ✅ `lib/db/object-id.ts` - ObjectId handling strategy (string ↔ ObjectId)
- ✅ `lib/db/date-utils.ts` - Date normalization utilities
- ✅ `lib/db/repositories/user.repository.ts` - User CRUD operations
- ✅ `lib/db/repositories/post.repository.ts` - Post CRUD with pagination
- ✅ `lib/db/repositories/comment.repository.ts` - Comment CRUD with cascade delete
- ✅ `lib/db/repositories/support-message.repository.ts` - Support message management
- ✅ `lib/db/repositories/backup.repository.ts` - Backup operations
- ✅ `lib/db/repositories/index.ts` - Central repository exports

**Authentication Layer**:
- ✅ `lib/auth/bcrypt.ts` - Bcrypt compatibility layer (bcryptjs, cost 10)
- ✅ `lib/db/test-bcrypt.ts` - Bcrypt compatibility test script

**Testing**:
- ✅ `lib/db/test-repositories.test.ts` - Unit tests for repository layer
- ✅ Bcrypt compatibility test: PASSED
- ✅ Repository unit tests: PASSED

**Documentation**:
- ✅ `docs/migration/index-recommendations.md` - Index strategy documentation
- ✅ `scripts/setup-indexes.ts` - Manual index creation script

**Configuration**:
- ✅ Database name: `tarihKulubu` (from environment variable)
- ✅ Serverless-safe connection pooling configured
- ✅ ObjectId strategy: strings in app, ObjectId at DB boundary

### Database Connection Availability

**Status**: No local MongoDB connection available during Phase 3.

**Impact**:
- Unit tests completed successfully with mocks
- Integration tests require real database connection
- Production verification pending (requires production database access)

### Test Results Summary

**Bcrypt Compatibility Test**: ✅ PASSED
```
Testing bcrypt compatibility...
✅ Bcrypt compatibility test PASSED
The current bcrypt implementation can:
  - Hash passwords with cost factor 10
  - Verify passwords against hashes
  - Reject incorrect passwords
```

**Repository Layer Tests**: ✅ PASSED
```
Running repository layer tests...
Testing ObjectId handling... ✅ PASSED
Testing legacy field compatibility... ✅ PASSED
Testing optional/null field handling... ✅ PASSED
Testing date handling... ✅ PASSED
✅ All repository layer tests passed
```

### Remaining Database Risks

1. **Production Verification**: Bcrypt hashes need verification against actual production database
2. **Index Creation**: Indexes not yet created (manual process required)
3. **Integration Testing**: Real database connection tests pending
4. **Data Migration**: No schema changes planned, but data integrity verification needed

### Dependencies for Phase 4

Before starting Phase 4 (Authentication):
- MongoDB connection credentials must be available
- Production database connection should be tested
- Index creation should be reviewed and executed
- Data integrity should be verified
