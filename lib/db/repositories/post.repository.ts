import { Db } from "mongodb";
import { getDb } from "../mongodb";
import { toObjectId, idMatchValues } from "../object-id";
import type {
  Post,
  CreatePostInput,
  UpdatePostInput,
} from "../../../types/post";

const COLLECTION_NAME = "posts";

export async function findById(id: string): Promise<Post | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ _id: toObjectId(id) });
  return document ? (document as unknown as Post) : null;
}

export async function findRecent(limit: number = 10): Promise<Post[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find()
    .sort({ date: -1 })
    .limit(limit)
    .toArray() as unknown as Promise<Post[]>;
}

/**
 * Arşiv listesi için tüm yazılar, en yeni önce.
 * Sayfalama/limit yoktur; filtresiz tüm yayınlanmış yazıları döner.
 */
export async function findAll(): Promise<Post[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find()
    .sort({ date: -1 })
    .toArray() as unknown as Promise<Post[]>;
}

export async function findPaginated(
  page: number = 1,
  pageSize: number = 10
): Promise<{ posts: Post[]; total: number; pages: number }> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const skip = (page - 1) * pageSize;
  const total = await collection.countDocuments();
  const pages = Math.ceil(total / pageSize);

  const posts = await collection
    .find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray() as unknown as Post[];

  return { posts, total, pages };
}

/**
 * Kullanıcının yazıları. Legacy kayıtlarda user_id ObjectId olarak
 * saklanır (Mongoose ref), yeni kayıtlarda string'tir; ikisi de eşleşir.
 */
export async function findByUserId(userId: string): Promise<Post[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection
    .find({ user_id: { $in: idMatchValues(userId) } })
    .sort({ date: -1 })
    .toArray() as unknown as Promise<Post[]>;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const post: Omit<Post, "_id"> = {
    user_id: input.user_id,
    username: input.username,
    title: input.title,
    content: input.content,
    images: input.images || [],
    date: new Date(),
  };

  const result = await collection.insertOne(post);
  const createdPost = await collection.findOne({ _id: result.insertedId });
  return createdPost as unknown as Post;
}

export async function updatePost(
  id: string,
  input: UpdatePostInput
): Promise<Post | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const updateData: Partial<Post> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.images !== undefined) updateData.images = input.images;

  await collection.updateOne(
    { _id: toObjectId(id) },
    { $set: updateData }
  );

  return findById(id);
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

/** Legacy parity: username değişince yazarın tüm yazılarındaki ad güncellenir. */
export async function updateUsernameByUserId(
  userId: string,
  username: string
): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.updateMany(
    { user_id: { $in: idMatchValues(userId) } },
    { $set: { username } }
  );
  return result.modifiedCount;
}

export async function deletePostsByUserId(userId: string): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteMany({ user_id: { $in: idMatchValues(userId) } });
  return result.deletedCount;
}

export async function countPosts(): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection.countDocuments();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Admin blog listesi: arama + yazar + dönem + sıralama (legacy parity). */
export async function findFiltered(filters: {
  q?: string;
  author?: string;
  period?: string;
  sort?: string;
}): Promise<Post[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};
  if (filters.q) {
    const rx = new RegExp(escapeRegExp(filters.q), "i");
    query.$or = [{ title: rx }, { content: rx }];
  }
  if (filters.author) {
    query.username = new RegExp(escapeRegExp(filters.author), "i");
  }
  if (filters.period) {
    const days = Number(filters.period);
    if (Number.isFinite(days) && days > 0) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      query.date = { $gte: fromDate };
    }
  }

  let sortQuery: Record<string, 1 | -1> = { date: -1 };
  if (filters.sort === "old") sortQuery = { date: 1 };
  if (filters.sort === "title") sortQuery = { title: 1 };

  return collection
    .find(query)
    .sort(sortQuery)
    .toArray() as unknown as Promise<Post[]>;
}
