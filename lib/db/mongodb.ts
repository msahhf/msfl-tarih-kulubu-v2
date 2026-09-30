import { MongoClient, Db } from "mongodb";

const dbName = process.env.MONGODB_DB || "tarihKulubu";

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return globalWithMongo._mongoClientPromise;
  }

  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  return globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  try {
    const client = await getClientPromise();
    const db = client.db(dbName);
    await ensureIndexes(db);
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

let indexesEnsured = false;

/**
 * Idempotent index setup (native driver has no schema-level
 * unique constraints like legacy Mongoose). Safe to call per request;
 * runs only once per instance.
 */
async function ensureIndexes(db: Db): Promise<void> {
  if (indexesEnsured) return;
  try {
    await Promise.all([
      db.collection("users").createIndex({ username: 1 }, { unique: true }),
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("tarihte_bugun").createIndex({ dateKey: 1 }, { unique: true }),
      db.collection("posts").createIndex({ date: -1 }),
      db.collection("posts").createIndex({ user_id: 1 }),
      db.collection("comments").createIndex({ post_id: 1 }),
      db.collection("comments").createIndex({ user_id: 1 }),
    ]);
    indexesEnsured = true;
  } catch (error) {
    // Index setup must never break request handling (e.g. limited DB roles).
    console.error("Database index setup warning:", error);
  }
}
