# MongoDB Index Recommendations

Based on legacy application query patterns analysis.

## Current Query Patterns

### User Collection
**Queries from legacy routes:**
- `User.findOne({ username })` - Login/registration uniqueness check
- `User.findOne({ email })` - Registration uniqueness check
- `User.findOne({ $or: [{ username }, { email }] })` - Combined uniqueness check

**Recommended Indexes:**
```javascript
// Unique index on username (already exists from Mongoose schema)
db.users.createIndex({ username: 1 }, { unique: true })

// Unique index on email (already exists from Mongoose schema)
db.users.createIndex({ email: 1 }, { unique: true })
```

**Status:** ✅ Already enforced by Mongoose unique constraints in legacy schema.

---

### Post Collection
**Queries from legacy routes:**
- `Post.find().sort({ date: -1 })` - Recent posts on homepage
- `Post.find({ user_id: userId })` - User's posts
- `Post.findById(id)` - Single post detail

**Recommended Indexes:**
```javascript
// Compound index for date-sorted queries
db.posts.createIndex({ date: -1 })

// Index for user-specific queries
db.posts.createIndex({ user_id: 1, date: -1 })
```

**Priority:** Medium - Date sorting benefits from index, user queries are less frequent.

---

### Comment Collection
**Queries from legacy routes:**
- `Comment.find({ post_id: postId })` - Comments for a post
- `Comment.find({ user_id: userId })` - User's comments
- Sort by date ascending/descending

**Recommended Indexes:**
```javascript
// Compound index for post comments with date sorting
db.comments.createIndex({ post_id: 1, date: 1 })

// Index for user comment history
db.comments.createIndex({ user_id: 1, date: -1 })
```

**Priority:** High - Post comment queries are very frequent on blog detail pages.

---

### SupportMessage Collection
**Queries from legacy routes:**
- `SupportMessage.find({ status })` - Admin filtering
- `SupportMessage.find({ email })` - Email search
- Sort by createdAt descending

**Recommended Indexes:**
```javascript
// Index for status filtering
db.supportmessages.createIndex({ status: 1, createdAt: -1 })

// Index for email search
db.supportmessages.createIndex({ email: 1 })
```

**Priority:** Low - Admin-only queries, low volume.

---

### Backup Collection
**Queries from legacy routes:**
- `Backup.find({ userId })` - User backup history
- Sort by deletedAt descending

**Recommended Indexes:**
```javascript
// Index for user backup queries
db.backups.createIndex({ userId: 1, deletedAt: -1 })
```

**Priority:** Low - Only used during account deletion, infrequent.

---

## Index Creation Strategy

**DO NOT create indexes automatically during application startup.**

**Recommended approach:**
1. Create a separate setup script: `scripts/setup-indexes.js`
2. Run manually in production after review
3. Document index creation in deployment notes
4. Use `createIndex` with `background: true` for large collections

**Example setup script:**
```javascript
import { getDb } from "../lib/db/mongodb.js";

async function setupIndexes() {
  const db = await getDb();

  // Comments (high priority)
  await db.collection("comments").createIndex(
    { post_id: 1, date: 1 },
    { background: true }
  );

  // Posts (medium priority)
  await db.collection("posts").createIndex(
    { date: -1 },
    { background: true }
  );
  await db.collection("posts").createIndex(
    { user_id: 1, date: -1 },
    { background: true }
  );

  // Support messages (low priority)
  await db.collection("supportmessages").createIndex(
    { status: 1, createdAt: -1 },
    { background: true }
  );

  // Backups (low priority)
  await db.collection("backups").createIndex(
    { userId: 1, deletedAt: -1 },
    { background: true }
  );

  console.log("Indexes created successfully");
  process.exit(0);
}

setupIndexes().catch(console.error);
```

---

## Notes

- **User indexes**: Already enforced by Mongoose unique constraints in legacy schema
- **Collection names**: Note that legacy uses lowercase collection names (users, posts, comments, supportmessages, backups)
- **Background creation**: Use `background: true` to avoid blocking operations
- **Review before production**: Always test index creation on staging environment first
- **Monitor performance**: After index creation, monitor query performance to validate improvement
