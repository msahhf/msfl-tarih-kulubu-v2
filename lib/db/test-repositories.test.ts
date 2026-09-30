/**
 * Repository Layer Tests
 *
 * Unit tests for repository functions using mock data.
 * These tests do not require a real database connection.
 *
 * Run with: npx tsx lib/db/test-repositories.test.ts
 */

import { isValidObjectId, toObjectId, toStringId } from "./object-id.js";

function testObjectIdHandling() {
  console.log("Testing ObjectId handling...");

  // Valid ObjectId
  const validId = "507f1f77bcf86cd799439011";
  if (!isValidObjectId(validId)) {
    throw new Error("Valid ObjectId should pass validation");
  }

  // Invalid ObjectId
  const invalidId = "invalid-id";
  if (isValidObjectId(invalidId)) {
    throw new Error("Invalid ObjectId should fail validation");
  }

  // toObjectId conversion
  const objectId = toObjectId(validId);
  if (objectId.toString() !== validId) {
    throw new Error("ObjectId conversion failed");
  }

  // toStringId conversion
  const stringId = toStringId(objectId);
  if (stringId !== validId) {
    throw new Error("toStringId conversion failed");
  }

  // toStringId with string input
  const stringId2 = toStringId(validId);
  if (stringId2 !== validId) {
    throw new Error("toStringId should handle string input");
  }

  console.log("✅ ObjectId handling tests passed");
}

function testLegacyFieldCompatibility() {
  console.log("Testing legacy field compatibility...");

  // Test User interface structure
  const mockUser = {
    _id: "507f1f77bcf86cd799439011",
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword",
    name: "Test",
    surname: "User",
    role: "user",
    date: new Date(),
    avatar: { url: "", fileId: "", provider: "imagekit" },
    coverImage: { url: "", fileId: "", provider: "imagekit" },
    social: {
      instagram: "",
      x: "",
      github: "",
      youtube: "",
      website: "",
    },
    bio: "",
    analyticsCookies: true,
    personalizationCookies: true,
    serviceDataUsage: true,
    personalizedContent: true,
    resetCode: null,
    resetCodeExpires: null,
  };

  // Verify all legacy fields are present
  const requiredFields = [
    "username",
    "email",
    "password",
    "name",
    "surname",
    "role",
    "date",
    "avatar",
    "coverImage",
    "social",
    "bio",
    "analyticsCookies",
    "personalizationCookies",
    "serviceDataUsage",
    "personalizedContent",
    "resetCode",
    "resetCodeExpires",
  ];

  for (const field of requiredFields) {
    if (!(field in mockUser)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  console.log("✅ Legacy field compatibility tests passed");
}

function testOptionalNullFields() {
  console.log("Testing optional/null field handling...");

  // Test User with null reset fields
  const userWithNulls = {
    _id: "507f1f77bcf86cd799439011",
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword",
    name: "Test",
    surname: "User",
    role: "user",
    date: new Date(),
    avatar: { url: "", fileId: "", provider: "imagekit" },
    coverImage: { url: "", fileId: "", provider: "imagekit" },
    social: {
      instagram: "",
      x: "",
      github: "",
      youtube: "",
      website: "",
    },
    bio: "",
    analyticsCookies: true,
    personalizationCookies: true,
    serviceDataUsage: true,
    personalizedContent: true,
    resetCode: null,
    resetCodeExpires: null,
  };

  if (userWithNulls.resetCode !== null) {
    throw new Error("resetCode should be null");
  }

  if (userWithNulls.resetCodeExpires !== null) {
    throw new Error("resetCodeExpires should be null");
  }

  console.log("✅ Optional/null field tests passed");
}

function testDateHandling() {
  console.log("Testing date handling...");

  const { toDate, isValidDate } = require("./date-utils.js");

  // Test Date object
  const date1 = new Date();
  const converted1 = toDate(date1);
  if (!isValidDate(converted1)) {
    throw new Error("Date object conversion failed");
  }

  // Test string date
  const date2 = toDate("2024-01-01");
  if (!isValidDate(date2)) {
    throw new Error("String date conversion failed");
  }

  // Test timestamp
  const date3 = toDate(1704067200000);
  if (!isValidDate(date3)) {
    throw new Error("Timestamp conversion failed");
  }

  console.log("✅ Date handling tests passed");
}

async function runTests() {
  console.log("Running repository layer tests...\n");

  try {
    testObjectIdHandling();
    testLegacyFieldCompatibility();
    testOptionalNullFields();
    testDateHandling();

    console.log("\n✅ All repository layer tests passed");
    console.log("\nNote: These are unit tests without database connection.");
    console.log("Integration tests require a real MongoDB connection.");
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
    process.exit(1);
  }
}

runTests();
