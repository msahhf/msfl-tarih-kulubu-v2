import { getDb } from "../mongodb";
import type { TarihteBugunEntry, TarihEvent } from "../../../types/tarihte-bugun";

const COLLECTION_NAME = "tarihte_bugun";

export async function findByDateKey(dateKey: string): Promise<TarihteBugunEntry | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const doc = await collection.findOne({ dateKey });
  return doc ? (doc as unknown as TarihteBugunEntry) : null;
}

export async function createOrUpsertEntry(data: {
  dateKey: string;
  events: TarihEvent[];
  originalAIContent: string;
  generatedBy?: string;
}): Promise<TarihteBugunEntry> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const now = new Date();
  const existing = await collection.findOne({ dateKey: data.dateKey });

  if (existing) {
    // If already exists, do not overwrite unless explicitly handled, but return existing
    return existing as unknown as TarihteBugunEntry;
  }

  const newEntry: Omit<TarihteBugunEntry, "_id"> = {
    dateKey: data.dateKey,
    events: data.events,
    originalAIContent: data.originalAIContent,
    generatedBy: data.generatedBy || "gemini",
    generatedAt: now,
    editedByAdmin: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newEntry);
  const created = await collection.findOne({ _id: result.insertedId });
  return created as unknown as TarihteBugunEntry;
}

export async function updateEvents(
  dateKey: string,
  events: TarihEvent[]
): Promise<TarihteBugunEntry | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const now = new Date();
  await collection.updateOne(
    { dateKey },
    {
      $set: {
        events,
        editedByAdmin: true,
        editedAt: now,
        updatedAt: now,
      },
    }
  );

  return findByDateKey(dateKey);
}

export async function regenerateWithAI(
  dateKey: string,
  events: TarihEvent[],
  originalAIContent: string
): Promise<TarihteBugunEntry | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const now = new Date();
  const existing = await collection.findOne({ dateKey });

  // Preserve the previous generation in history before overwriting.
  if (existing?.events && existing?.originalAIContent) {
    await collection.updateOne(
      { dateKey },
      {
        $push: {
          history: {
            events: existing.events,
            originalAIContent: existing.originalAIContent,
            generatedBy: existing.generatedBy || "gemini",
            generatedAt: existing.generatedAt || existing.createdAt || now,
          },
        },
      } as never
    );
  }

  await collection.updateOne(
    { dateKey },
    {
      $set: {
        events,
        originalAIContent,
        generatedAt: now,
        updatedAt: now,
      },
    }
  );

  return findByDateKey(dateKey);
}

export async function listAll(): Promise<TarihteBugunEntry[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const docs = await collection.find().sort({ dateKey: -1 }).toArray();
  return docs as unknown as TarihteBugunEntry[];
}
