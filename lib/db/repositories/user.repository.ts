import { Db, ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import { toObjectId, toStringId } from "../object-id";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  PasswordResetInput,
  SocialLinks,
} from "../../../types/user";

const COLLECTION_NAME = "users";

export async function findById(id: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ _id: toObjectId(id) });
  return document ? (document as unknown as User) : null;
}

export async function findByUsername(username: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ username });
  return document ? (document as unknown as User) : null;
}

export async function findByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({ email });
  return document ? (document as unknown as User) : null;
}

export async function findByUsernameExcludingId(
  username: string,
  excludeId: string
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({
    username,
    _id: { $ne: toObjectId(excludeId) },
  });
  return document ? (document as unknown as User) : null;
}

export async function findByEmailExcludingId(
  email: string,
  excludeId: string
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({
    email,
    _id: { $ne: toObjectId(excludeId) },
  });
  return document ? (document as unknown as User) : null;
}

export async function findByResetCode(hashedToken: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const document = await collection.findOne({
    resetCode: hashedToken,
    resetCodeExpires: { $gt: Date.now() },
  });
  return document ? (document as unknown as User) : null;
}

export async function updatePasswordAndClearReset(
  id: string,
  hashedPassword: string
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { _id: toObjectId(id) },
    {
      $set: { password: hashedPassword },
      $unset: { resetCode: "", resetCodeExpires: "" },
    }
  );

  return findById(id);
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const user: Omit<User, "_id"> = {
    username: input.username,
    email: input.email,
    password: input.password,
    name: input.name,
    surname: input.surname,
    role: input.role || "user",
    date: new Date(),
    avatar: { url: "", fileId: "", provider: "imagekit" },
    coverImage: { url: "", fileId: "", provider: "imagekit" },
    social: {
      instagram: "",
      x: "",
      github: "",
      youtube: "",
      website: "",
    },
    bio: "",
    analyticsCookies: input.analyticsCookies ?? true,
    personalizationCookies: input.personalizationCookies ?? true,
    serviceDataUsage: input.serviceDataUsage ?? true,
    personalizedContent: input.personalizedContent ?? true,
    resetCode: null,
    resetCodeExpires: null,
  };

  const result = await collection.insertOne(user);
  const createdUser = await collection.findOne({ _id: result.insertedId });
  return createdUser as unknown as User;
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const updateData: Partial<User> = {};
  if (input.username !== undefined) updateData.username = input.username;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.name !== undefined) updateData.name = input.name;
  if (input.surname !== undefined) updateData.surname = input.surname;
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.avatar !== undefined) updateData.avatar = input.avatar;
  if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
  if (input.social !== undefined) {
    updateData.social = { ...updateData.social, ...input.social } as SocialLinks;
  }
  if (input.analyticsCookies !== undefined)
    updateData.analyticsCookies = input.analyticsCookies;
  if (input.personalizationCookies !== undefined)
    updateData.personalizationCookies = input.personalizationCookies;
  if (input.serviceDataUsage !== undefined)
    updateData.serviceDataUsage = input.serviceDataUsage;
  if (input.personalizedContent !== undefined)
    updateData.personalizedContent = input.personalizedContent;

  await collection.updateOne(
    { _id: toObjectId(id) },
    { $set: updateData }
  );

  return findById(id);
}

export async function setPasswordReset(
  id: string,
  input: PasswordResetInput
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        resetCode: input.resetCode,
        resetCodeExpires: input.resetCodeExpires,
      },
    }
  );

  return findById(id);
}

export async function clearPasswordReset(id: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        resetCode: null,
        resetCodeExpires: null,
      },
    }
  );

  return findById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

export async function setRole(id: string, role: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne({ _id: toObjectId(id) }, { $set: { role } });

  return findById(id);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Admin kullanıcı listesi: arama + rol + dönem + sıralama (legacy parity). */
export async function findFiltered(filters: {
  q?: string;
  role?: string;
  period?: string;
  sort?: string;
}): Promise<User[]> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};
  if (filters.q) {
    const rx = new RegExp(escapeRegExp(filters.q), "i");
    query.$or = [{ username: rx }, { email: rx }, { name: rx }, { surname: rx }];
  }
  if (filters.role) {
    query.role = filters.role;
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
  if (filters.sort === "name") sortQuery = { username: 1 };

  return collection
    .find(query)
    .sort(sortQuery)
    .toArray() as unknown as Promise<User[]>;
}

export async function countUsers(): Promise<number> {
  const db = await getDb();
  const collection = db.collection(COLLECTION_NAME);
  return collection.countDocuments();
}
