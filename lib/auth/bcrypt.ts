import bcrypt from "bcryptjs";

/**
 * Bcrypt Compatibility Layer
 *
 * This module provides bcrypt hashing and verification functions
 * compatible with the legacy application's password storage.
 *
 * Legacy system used bcrypt with cost factor 10.
 * New system should maintain the same cost factor for compatibility.
 *
 * Note: Using bcryptjs (pure JavaScript implementation) instead of
 * bcrypt (native module) for better compatibility across environments.
 * bcryptjs produces the same hash format as bcrypt for the same cost factor.
 */

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Test bcrypt compatibility
 * This function tests that the current bcrypt implementation
 * can hash and verify passwords correctly.
 */
export async function testBcryptCompatibility(): Promise<boolean> {
  try {
    const testPassword = "test-password-123";
    const hash = await hashPassword(testPassword);
    const isValid = await verifyPassword(testPassword, hash);

    if (!isValid) {
      throw new Error("Bcrypt verification failed");
    }

    // Test that wrong password fails
    const isInvalid = await verifyPassword("wrong-password", hash);
    if (isInvalid) {
      throw new Error("Bcrypt should reject wrong password");
    }

    return true;
  } catch (error) {
    console.error("Bcrypt compatibility test failed:", error);
    return false;
  }
}
