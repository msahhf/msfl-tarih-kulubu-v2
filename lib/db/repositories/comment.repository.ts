import { Db } from "mongodb";
import { getDb } from "../mongodb";
import { toObjectId } from "../object-id";
import type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
} from "../../../types/comment";

const COLLECTION_NAME = "comments";

export async function findById(id: string): Promise<Comment | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ _id: toObjectId(id) });
  return document ? (document as unknown as Comment) : null;
}

export async function findByPostId(postId: string): Promise<Comment[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find({ post_id: postId })
    .sort({ date: -1 })
    .toArray() as unknown as Promise<Comment[]>;
}

export async function findByUserId(userId: string): Promise<Comment[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find({ user_id: userId })
    .sort({ date: -1 })
    .toArray() as unknown as Promise<Comment[]>;
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const comment: Omit<Comment, "_id"> = {
    post_id: input.post_id,
    user_id: input.user_id,
    username: input.username,
    content: input.content,
    date: new Date(),
  };

  const result = await collection.insertOne(comment);
  const createdComment = await collection.findOne({ _id: result.insertedId });
  return createdComment as unknown as Comment;
}

export async function updateComment(
  id: string,
  input: UpdateCommentInput
): Promise<Comment | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { _id: toObjectId(id) },
    { $set: { content: input.content } }
  );

  return findById(id);
}

export async function deleteComment(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteCommentsByPostId(postId: string): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteMany({ post_id: postId });
  return result.deletedCount;
}

export async function deleteCommentsByUserId(userId: string): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteMany({ user_id: userId });
  return result.deletedCount;
}

export async function countComments(): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection.countDocuments();
}

/** Admin yorum listesi: arama + dönem, en yeni önce, en fazla 200 (legacy parity). */
export async function findFiltered(filters: {
  q?: string;
  period?: string;
  limit?: number;
}): Promise<Comment[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};
  if (filters.q) {
    const rx = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ username: rx }, { content: rx }];
  }
  if (filters.period) {
    const days = Number(filters.period);
    if (Number.isFinite(days) && days > 0) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      query.date = { $gte: fromDate };
    }
  }

  return collection
    .find(query)
    .sort({ date: -1 })
    .limit(filters.limit ?? 200)
    .toArray() as unknown as Promise<Comment[]>;
}
