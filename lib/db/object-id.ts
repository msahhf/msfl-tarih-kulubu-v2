import { ObjectId } from "mongodb";

/**
 * ObjectId Handling Strategy
 *
 * Strategy: Use strings throughout the application, convert to ObjectId only at database boundaries.
 *
 * Rationale:
 * - Strings are easier to work with in URLs, forms, and APIs
 * - ObjectId conversion happens only in repository layer
 * - Reduces type conversion complexity in business logic
 * - Compatible with JSON serialization
 *
 * Rules:
 * - All public APIs use string IDs
 * - Repository layer converts string -> ObjectId for queries
 * - Repository layer converts ObjectId -> string for responses
 * - Never expose ObjectId to client components
 */

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

/**
 * Match values for legacy reference fields (user_id, post_id).
 *
 * Legacy Mongoose stored these fields as ObjectId (schema refs), while the
 * rewrite writes plain strings. MongoDB queries are type-strict, so reads on
 * these fields must match both shapes until old records are migrated.
 *
 * Returns the id itself when it is not a valid ObjectId hex string.
 */
export function idMatchValues(id: string): (ObjectId | string)[] {
  if (!isValidObjectId(id)) {
    return [id];
  }
  return [toObjectId(id), id];
}
