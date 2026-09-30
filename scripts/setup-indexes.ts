/**
 * MongoDB Index Setup Script
 *
 * This script creates recommended indexes for the database.
 * DO NOT run this automatically during application startup.
 * Run manually after review: npx tsx scripts/setup-indexes.ts
 *
 * IMPORTANT:
 * - This script creates indexes in the database
 * - Run only after reviewing the index recommendations
 * - Test on staging environment first
 * - Use background: true for large collections
 */

import { getDb } from "../lib/db/mongodb.js";

async function setupIndexes() {
  console.log("Setting up MongoDB indexes...");

  try {
    const db = await getDb();

    // Comments (high priority)
    console.log("Creating comment indexes...");
    await db.collection("comments").createIndex(
      { post_id: 1, date: 1 },
      { background: true }
    );
    await db.collection("comments").createIndex(
      { user_id: 1, date: -1 },
      { background: true }
    );

    // Posts (medium priority)
    console.log("Creating post indexes...");
    await db.collection("posts").createIndex(
      { date: -1 },
      { background: true }
    );
    await db.collection("posts").createIndex(
      { user_id: 1, date: -1 },
      { background: true }
    );

    // Support messages (low priority)
    console.log("Creating support message indexes...");
    await db.collection("supportmessages").createIndex(
      { status: 1, createdAt: -1 },
      { background: true }
    );
    await db.collection("supportmessages").createIndex(
      { email: 1 },
      { background: true }
    );

    // Backups (low priority)
    console.log("Creating backup indexes...");
    await db.collection("backups").createIndex(
      { userId: 1, deletedAt: -1 },
      { background: true }
    );

    console.log("✅ All indexes created successfully");
    console.log("\nIndex creation summary:");
    console.log("- comments: post_id+date, user_id+date");
    console.log("- posts: date, user_id+date");
    console.log("- supportmessages: status+createdAt, email");
    console.log("- backups: userId+deletedAt");

    process.exit(0);
  } catch (error) {
    console.error("❌ Index creation failed:", error);
    process.exit(1);
  }
}

setupIndexes();
