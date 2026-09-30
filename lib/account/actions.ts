"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession, createSession, deleteSession } from "@/lib/auth/session";
import {
  findById,
  findByUsernameExcludingId,
  findByEmailExcludingId,
  updateUser,
  updatePasswordAndClearReset,
  deleteUser,
} from "@/lib/db/repositories/user.repository";
import {
  postRepository,
  commentRepository,
  backupRepository,
} from "@/lib/db/repositories";
import {
  profileSchema,
  socialSchema,
  preferencesSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "@/lib/validation/account";
import { hashPassword, verifyPassword } from "@/lib/auth/bcrypt";
import { deleteImageFromImageKit, deleteImagesFromImageKit } from "@/lib/services/imagekit";

function parseMedia(raw: FormDataEntryValue | null) {
  if (!raw || !raw.toString().trim()) return undefined;
  try {
    const parsed = JSON.parse(raw.toString());
    // ImageUploader submits an array; edit forms may submit a single object.
    const item = Array.isArray(parsed) ? parsed[0] : parsed;
    if (item?.url && item?.fileId) {
      return {
        url: String(item.url),
        fileId: String(item.fileId),
        provider: "imagekit" as const,
      };
    }
  } catch {
    // Invalid payload: ignore, keep existing media.
  }
  return undefined;
}

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }
  const userId = session._id as string;

  const validated = profileSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    surname: formData.get("surname")?.toString() ?? "",
    username: formData.get("username")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
  });
  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz profil verisi"
    );
    redirect(`/hesap?error=${message}`);
  }

  const currentUser = await findById(userId);
  if (!currentUser) {
    redirect("/giris");
  }

  const { username, email } = validated.data;

  if (username !== currentUser.username) {
    const existing = await findByUsernameExcludingId(username, userId);
    if (existing) {
      redirect("/hesap?error=Kullanıcı+adı+kullanımda");
    }
  }
  if (email !== currentUser.email) {
    const existing = await findByEmailExcludingId(email, userId);
    if (existing) {
      redirect("/hesap?error=Bu+e-posta+kullanımda");
    }
  }

  const oldUsername = currentUser.username;

  // Avatar / cover: replace only when a new upload was provided.
  const avatar = parseMedia(formData.get("avatar"));
  const coverImage = parseMedia(formData.get("coverImage"));

  if (avatar && currentUser.avatar?.fileId && currentUser.avatar.fileId !== avatar.fileId) {
    await deleteImageFromImageKit(currentUser.avatar.fileId);
  }
  if (
    coverImage &&
    currentUser.coverImage?.fileId &&
    currentUser.coverImage.fileId !== coverImage.fileId
  ) {
    await deleteImageFromImageKit(currentUser.coverImage.fileId);
  }

  await updateUser(userId, {
    name: validated.data.name,
    surname: validated.data.surname,
    username,
    email,
    bio: validated.data.bio,
    ...(avatar ? { avatar } : {}),
    ...(coverImage ? { coverImage } : {}),
  });

  // Legacy parity: propagate username change to the author's posts.
  if (username !== oldUsername) {
    await postRepository.updateUsernameByUserId(userId, username);
  }

  // Refresh session so header/profile links use the new identity.
  const updated = await findById(userId);
  if (updated) {
    await createSession({
      _id: updated._id.toString(),
      username: updated.username,
      email: updated.email,
      role: updated.role,
    });
  }

  revalidatePath("/hesap");
  revalidatePath(`/u/${oldUsername}`);
  if (username !== oldUsername) {
    revalidatePath(`/u/${username}`);
  }

  redirect("/hesap?success=Profil+bilgileri+güncellendi");
}

export async function updateSocialAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const validated = socialSchema.safeParse({
    instagram: formData.get("instagram")?.toString() ?? "",
    x: formData.get("x")?.toString() ?? "",
    github: formData.get("github")?.toString() ?? "",
    youtube: formData.get("youtube")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  });
  if (!validated.success) {
    redirect("/hesap?error=Geçersiz+sosyal+medya+verisi");
  }

  try {
    await updateUser(session._id as string, { social: validated.data });
  } catch (e) {
    console.error("Update social error:", e);
    redirect("/hesap?error=Bir+hata+oluştu");
  }

  revalidatePath("/hesap");
  revalidatePath(`/u/${session.username}`);
  redirect("/hesap?success=Sosyal+medya+güncellendi");
}

export async function updatePreferencesAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const validated = preferencesSchema.safeParse({
    analyticsCookies: formData.get("analyticsCookies") === "on",
    personalizationCookies: formData.get("personalizationCookies") === "on",
    serviceDataUsage: formData.get("serviceDataUsage") === "on",
    personalizedContent: formData.get("personalizedContent") === "on",
  });
  if (!validated.success) {
    redirect("/hesap?error=Geçersiz+tercih+verisi");
  }

  try {
    await updateUser(session._id as string, validated.data);
  } catch (e) {
    console.error("Update preferences error:", e);
    redirect("/hesap?error=Bir+hata+oluştu");
  }

  redirect("/hesap?success=Ayarlar+güncellendi");
}

export async function changePasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }
  const userId = session._id as string;

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword")?.toString() ?? "",
    newPassword: formData.get("newPassword")?.toString() ?? "",
    newPasswordConfirm: formData.get("newPasswordConfirm")?.toString() ?? "",
  });
  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz şifre verisi"
    );
    redirect(`/hesap?error=${message}`);
  }

  const user = await findById(userId);
  if (!user) {
    redirect("/giris");
  }

  const valid = await verifyPassword(validated.data.currentPassword, user.password);
  if (!valid) {
    redirect("/hesap?error=Mevcut+şifre+hatalı");
  }

  await updatePasswordAndClearReset(
    userId,
    await hashPassword(validated.data.newPassword)
  );

  redirect("/hesap?success=Şifre+değiştirildi");
}

export async function deleteAccountAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }
  const userId = session._id as string;

  const validated = deleteAccountSchema.safeParse({
    password: formData.get("password")?.toString() ?? "",
  });
  if (!validated.success) {
    redirect("/hesap?error=Onay+için+şifrenizi+girin");
  }

  const user = await findById(userId);
  if (!user) {
    redirect("/giris");
  }

  const valid = await verifyPassword(validated.data.password, user.password);
  if (!valid) {
    redirect("/hesap?error=Şifre+hatalı");
  }

  try {
    const posts = await postRepository.findByUserId(userId);
    const comments = await commentRepository.findByUserId(userId);

    await backupRepository.createBackup({
      userId,
      username: user.username,
      email: user.email,
      userData: {
        profile: user,
        posts,
        comments,
      },
    });

    if (user.avatar?.fileId) {
      await deleteImageFromImageKit(user.avatar.fileId);
    }
    if (user.coverImage?.fileId) {
      await deleteImageFromImageKit(user.coverImage.fileId);
    }
    const postImageIds = posts.flatMap((p) => (p.images || []).map((img) => img.fileId));
    if (postImageIds.length > 0) {
      await deleteImagesFromImageKit(postImageIds);
    }

    await postRepository.deletePostsByUserId(userId);
    await commentRepository.deleteCommentsByUserId(userId);
    await deleteUser(userId);

    revalidatePath(`/u/${user.username}`);
  } catch (e) {
    console.error("Delete account error:", e);
    redirect("/hesap?error=Hesap+silinirken+bir+hata+oluştu");
  }

  await deleteSession();
  redirect("/?success=Hesap+silindi");
}
