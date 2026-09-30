import { Db } from "mongodb";
import { getDb } from "../mongodb";
import { toObjectId } from "../object-id";
import type {
  SupportMessage,
  CreateSupportMessageInput,
  UpdateSupportMessageInput,
} from "../../../types/support-message";

const COLLECTION_NAME = "supportmessages";

export async function findById(id: string): Promise<SupportMessage | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ _id: toObjectId(id) });
  return document ? (document as unknown as SupportMessage) : null;
}

export async function findFiltered(filters: {
  status?: string;
  email?: string;
  q?: string;
  topic?: string;
}): Promise<SupportMessage[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.email) query.email = filters.email;
  if (filters.topic) query.topic = filters.topic;
  if (filters.q) {
    const rx = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { email: rx }, { message: rx }];
  }

  return collection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray() as unknown as Promise<SupportMessage[]>;
}

export async function createMessage(
  input: CreateSupportMessageInput
): Promise<SupportMessage> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const message: Omit<SupportMessage, "_id"> = {
    name: input.name || null,
    email: input.email,
    topic: input.topic || "Diğer",
    message: input.message,
    user_id: input.user_id || null,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(message);
  const createdMessage = await collection.findOne({ _id: result.insertedId });
  return createdMessage as unknown as SupportMessage;
}

export async function updateStatus(
  id: string,
  input: UpdateSupportMessageInput
): Promise<SupportMessage | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        status: input.status,
        updatedAt: new Date(),
      },
    }
  );

  return findById(id);
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

export async function countMessages(filters?: {
  status?: string;
}): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};
  if (filters?.status) query.status = filters.status;

  return collection.countDocuments(query);
}
