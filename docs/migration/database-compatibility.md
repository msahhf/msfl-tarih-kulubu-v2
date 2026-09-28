# Database Compatibility

## Overview

Bu doküman, mevcut MongoDB veri modellerinin Next.js rewrite'ı ile uyumluluğunu detaylandırır. Mevcut production verilerinin kaybolmaması için kritik öneme sahiptir.

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

#### New TypeScript Interface

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  password: string; // bcrypt hash
  name: string;
  surname: string;
  role: 'user' | 'admin';
  date: Date;
  
  avatar: {
    url: string;
    fileId: string;
    provider: 'imagekit';
  };
  
  coverImage: {
    url: string;
    fileId: string;
    provider: 'imagekit';
  };
  
  social: {
    instagram: string;
    x: string;
    github: string;
    youtube: string;
    website: string;
  };
  
  bio: string;
  
  analyticsCookies: boolean;
  personalizationCookies: boolean;
  serviceDataUsage: boolean;
  personalizedContent: boolean;
  
  resetCode: string | null;
  resetCodeExpires: Date | null;
}
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields must be preserved
- Bcrypt password hashes must remain compatible
- ImageKit structure must remain unchanged
- Social media fields must remain unchanged
- Cookie preferences must remain unchanged

**⚠️ Migration Considerations**:
- Add email verification status (optional future feature)
- Add last login tracking (optional future feature)
- Add account status (active/suspended) (optional future feature)

**Bcrypt Compatibility**:
```typescript
// Legacy bcrypt cost: 10
// New system must support cost 10-12
import bcrypt from 'bcrypt';

// Verify existing password
const isValid = await bcrypt.compare(plainPassword, user.password);

// Hash new password (same cost as legacy)
const hashedPassword = await bcrypt.hash(plainPassword, 10);
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

#### New TypeScript Interface

```typescript
interface Post {
  _id: string;
  user_id: string; // ObjectId as string
  username: string; // denormalized
  title: string;
  content: string; // HTML content
  images: Array<{
    url: string;
    fileId: string;
    provider: 'imagekit';
  }>;
  date: Date;
}
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields must be preserved
- ImageKit structure must remain unchanged
- HTML content must be preserved (but sanitized on render)
- Denormalized username must be preserved

**⚠️ Migration Considerations**:
- Add slug generation (optional future feature)
- Add tags/categories (optional future feature)
- Add published/draft status (optional future feature)
- Add featured flag (optional future feature)

**HTML Content Sanitization**:
```typescript
import DOMPurify from 'dompurify';

// Render with sanitization
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

#### New TypeScript Interface

```typescript
interface Comment {
  _id: string;
  post_id: string; // ObjectId as string
  user_id: string; // ObjectId as string
  username: string;
  content: string;
  date: Date;
}
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields must be preserved
- Denormalized username must be preserved
- Flat comment structure must be preserved

**⚠️ Migration Considerations**:
- Add parent comment (nested comments) (optional future feature)
- Add edit history (optional future feature)
- Add status (approved/hidden) (optional future feature)

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

#### New TypeScript Interface

```typescript
interface SupportMessage {
  _id: string;
  name: string | null;
  email: string;
  topic: string;
  message: string;
  user_id: string | null; // ObjectId as string
  status: 'new' | 'read' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields must be preserved
- Status workflow must be preserved
- Timestamps must be preserved

**⚠️ Migration Considerations**:
- Add canned responses (optional future feature)
- Add email notifications (optional future feature)

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

#### New TypeScript Interface

```typescript
interface Backup {
  _id: string;
  userId: string; // ObjectId as string
  username: string;
  email: string;
  deletedAt: Date;
  
  ipHistory: string[];
  loginHistory: any[];
  deviceInfo: any[];
  
  userData: {
    profile: User;
    posts: Post[];
    comments: Comment[];
  };
}
```

#### Compatibility Notes

**✅ Preserve (No Changes)**:
- All existing fields must be preserved
- Backup structure must remain unchanged

**⚠️ Migration Considerations**:
- Add restore functionality (optional future feature)
- Add cleanup policy (optional future feature)

**Critical**: Backup system must work exactly as legacy. No data loss on account deletion.

## Index Strategy

### Current Indexes (Inferred from Usage)

```javascript
// Users
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Posts
db.posts.createIndex({ user_id: 1 });
db.posts.createIndex({ username: 1 });
db.posts.createIndex({ date: -1 });

// Comments
db.comments.createIndex({ post_id: 1 });
db.comments.createIndex({ user_id: 1 });
db.comments.createIndex({ username: 1 });
db.comments.createIndex({ date: -1 });

// SupportMessage
db.supportmessages.createIndex({ email: 1 });
db.supportmessages.createIndex({ user_id: 1 });
db.supportmessages.createIndex({ status: 1 });
db.supportmessages.createIndex({ createdAt: -1 });

// Backup
db.backups.createIndex({ userId: 1 });
db.backups.createIndex({ deletedAt: -1 });
```

### New Index Recommendations

```javascript
// Keep all existing indexes
// Add compound indexes for common queries

// Posts - Search optimization
db.posts.createIndex({ title: "text", content: "text" });

// Comments - Moderation optimization
db.comments.createIndex({ post_id: 1, date: -1 });

// SupportMessage - Admin filtering
db.supportmessages.createIndex({ status: 1, createdAt: -1 });
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
