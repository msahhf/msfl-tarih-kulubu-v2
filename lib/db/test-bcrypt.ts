/**
 * Bcrypt Compatibility Test
 *
 * This script tests bcrypt compatibility without requiring a database connection.
 * Run with: npx tsx lib/db/test-bcrypt.ts
 */

import { testBcryptCompatibility } from "../auth/bcrypt.js";

async function runTest() {
  console.log("Testing bcrypt compatibility...");
  const result = await testBcryptCompatibility();

  if (result) {
    console.log("✅ Bcrypt compatibility test PASSED");
    console.log("The current bcrypt implementation can:");
    console.log("  - Hash passwords with cost factor 10");
    console.log("  - Verify passwords against hashes");
    console.log("  - Reject incorrect passwords");
    console.log("\nNote: Production verification still requires checking");
    console.log("against actual production database hashes.");
  } else {
    console.log("❌ Bcrypt compatibility test FAILED");
    console.log("There may be an issue with the bcrypt implementation.");
    process.exit(1);
  }
}

runTest().catch(console.error);
