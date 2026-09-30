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
