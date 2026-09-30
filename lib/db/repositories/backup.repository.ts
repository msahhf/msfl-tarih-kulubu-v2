import { Db } from "mongodb";
import { getDb } from "../mongodb";
import { toObjectId } from "../object-id";
import type {
  Backup,
  CreateBackupInput,
} from "../../../types/backup";

const COLLECTION_NAME = "backups";

export async function findById(id: string): Promise<Backup | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ _id: toObjectId(id) });
  return document ? (document as unknown as Backup) : null;
}

export async function findByUserId(userId: string): Promise<Backup[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find({ userId })
    .sort({ deletedAt: -1 })
    .toArray() as unknown as Promise<Backup[]>;
}

export async function createBackup(input: CreateBackupInput): Promise<Backup> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const backup: Omit<Backup, "_id"> = {
    userId: input.userId,
    username: input.username || null,
    email: input.email || null,
    deletedAt: new Date(),
    ipHistory: input.ipHistory || [],
    loginHistory: input.loginHistory || [],
    deviceInfo: input.deviceInfo || [],
    userData: input.userData,
  };

  const result = await collection.insertOne(backup);
  const createdBackup = await collection.findOne({ _id: result.insertedId });
  return createdBackup as unknown as Backup;
}

export async function deleteBackup(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

export async function countBackups(): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection.countDocuments();
}
