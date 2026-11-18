import { getDb } from "../mongodb";
import { toObjectId, toStringId } from "../object-id";
import type {
  CreateMagazineNoteInput,
  MagazineNote,
  PublicMagazineNote,
} from "../../../types/magazine-note";

const COLLECTION_NAME = "magazine_notes";

/** Bir sayı için listelenen en fazla not sayısı (tek istekte). */
export const MAX_NOTES_PER_ISSUE = 400;

/** Veritabanı kaydını istemciye güvenli görünüme çevirir (e-posta hariç). */
export function toPublicNote(note: MagazineNote): PublicMagazineNote {
  return {
    id: toStringId(note._id),
    page: note.page,
    anchor: note.anchor ?? null,
    body: note.body,
    name: note.name ?? null,
    createdAt: new Date(note.createdAt).toISOString(),
  };
}

export async function findByIssue(issueSlug: string): Promise<MagazineNote[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const documents = await collection
    .find({ issueSlug })
    .sort({ page: 1, createdAt: 1 })
    .limit(MAX_NOTES_PER_ISSUE)
    .toArray();
  return documents as unknown as MagazineNote[];
}

export async function countByIssue(issueSlug: string): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection.countDocuments({ issueSlug });
}

/** Aynı e-posta ile belirli bir tarihten sonra gönderilen notların zamanları. */
export async function findRecentByEmail(
  email: string,
  since: Date,
  limit = 20
): Promise<Date[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const documents = await collection
    .find(
      { email, createdAt: { $gte: since } },
      { projection: { _id: 0, createdAt: 1 } }
    )
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return documents.map((document) => new Date(document.createdAt as Date));
}

export async function createNote(
  input: CreateMagazineNoteInput
): Promise<MagazineNote> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const note: Omit<MagazineNote, "_id"> = {
    issueSlug: input.issueSlug,
    page: input.page,
    anchor: input.anchor,
    body: input.body,
    name: input.name,
    email: input.email,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(note);
  const created = await collection.findOne({ _id: result.insertedId });
  return created as unknown as MagazineNote;
}

export async function deleteNote(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Yayından kaldırılan sayıların notlarını temizlemek için.
 */
export async function deleteByIssue(issueSlug: string): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteMany({ issueSlug });
  return result.deletedCount;
}
