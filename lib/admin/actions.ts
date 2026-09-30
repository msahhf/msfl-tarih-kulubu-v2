"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/admin/auth";
import {
  findById as findUserById,
  setRole,
  deleteUser,
} from "@/lib/db/repositories/user.repository";
import {
  postRepository,
  commentRepository,
  backupRepository,
  supportMessageRepository,
  tarihteBugunRepository,
} from "@/lib/db/repositories";
import { commentSchema } from "@/lib/validation/blog";
import { generateTarihteBugunFromGemini } from "@/lib/services/gemini";
import { deleteImageFromImageKit, deleteImagesFromImageKit } from "@/lib/services/imagekit";

async function requireAdminOrRedirect(): Promise<string | null> {
  const ok = await isAdminSession();
  if (!ok) {
    redirect("/admin/giris");
  }
  return null;
}

const VALID_ROLES = ["user", "admin"] as const;

export async function adminToggleRoleAction(formData: FormData) {
  await requireAdminOrRedirect();

  const userId = formData.get("userId")?.toString();
  if (!userId) {
    redirect("/admin/kullanicilar?error=Kullanıcı+bulunamadı");
  }

  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();

  // Admin kendi yetkisini düşüremez (kilitlenme koruması).
  if (session && session.userId === userId) {
    redirect(`/admin/kullanici/${userId}?error=Kendi+rolünüzü+değiştiremezsiniz`);
  }

  const target = await findUserById(userId);
  if (!target) {
    redirect("/admin/kullanicilar?error=Kullanıcı+bulunamadı");
  }

  const nextRole = target.role === "admin" ? "user" : "admin";
  if (!(VALID_ROLES as readonly string[]).includes(nextRole)) {
    redirect("/admin/kullanicilar?error=Geçersiz+rol");
  }

  await setRole(userId, nextRole);
  revalidatePath("/admin/kullanicilar");
  redirect(`/admin/kullanici/${userId}?success=Rol+güncellendi`);
}

export async function adminDeleteUserAction(formData: FormData) {
  await requireAdminOrRedirect();

  const userId = formData.get("userId")?.toString();
  if (!userId) {
    redirect("/admin/kullanicilar?error=Kullanıcı+bulunamadı");
  }

  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (session && session.userId === userId) {
    redirect(`/admin/kullanici/${userId}?error=Kendi+hesabınızı+silemezsiniz`);
  }

  const user = await findUserById(userId);
  if (!user) {
    redirect("/admin/kullanicilar?error=Kullanıcı+bulunamadı");
  }

  try {
    const posts = await postRepository.findByUserId(userId);
    const comments = await commentRepository.findByUserId(userId);

    await backupRepository.createBackup({
      userId,
      username: user.username,
      email: user.email,
      userData: { profile: user, posts, comments },
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

    revalidatePath("/admin/kullanicilar");
    revalidatePath(`/u/${user.username}`);
  } catch (e) {
    console.error("Admin delete user error:", e);
    redirect("/admin/kullanicilar?error=Silme+işlemi+başarısız");
  }

  redirect("/admin/kullanicilar?success=Kullanıcı+silindi");
}

export async function adminDeleteBlogAction(formData: FormData) {
  await requireAdminOrRedirect();

  const postId = formData.get("postId")?.toString();
  if (!postId) {
    redirect("/admin/bloglar?error=Blog+bulunamadı");
  }

  try {
    const post = await postRepository.findById(postId);
    if (post) {
      const fileIds = (post.images || []).map((img) => img.fileId).filter(Boolean);
      if (fileIds.length > 0) {
        await deleteImagesFromImageKit(fileIds);
      }
      await commentRepository.deleteCommentsByPostId(postId);
      await postRepository.deletePost(postId);
      revalidatePath("/blog");
      revalidatePath(`/blog/${postId}`);
    }
  } catch (e) {
    console.error("Admin delete blog error:", e);
    redirect("/admin/bloglar?error=Silme+işlemi+başarısız");
  }

  redirect("/admin/bloglar?success=Blog+silindi");
}

export async function adminUpdateCommentAction(formData: FormData) {
  await requireAdminOrRedirect();

  const commentId = formData.get("commentId")?.toString();
  if (!commentId) {
    redirect("/admin/yorumlar?error=Yorum+bulunamadı");
  }

  const validated = commentSchema.safeParse({
    content: formData.get("content")?.toString() ?? "",
  });
  if (!validated.success) {
    redirect(`/admin/yorum/${commentId}/duzenle?error=Geçersiz+yorum`);
  }

  try {
    await commentRepository.updateComment(commentId, {
      content: validated.data.content,
    });
    revalidatePath("/admin/yorumlar");
  } catch (e) {
    console.error("Admin update comment error:", e);
    redirect("/admin/yorumlar?error=Güncelleme+başarısız");
  }

  redirect("/admin/yorumlar?success=Yorum+güncellendi");
}

export async function adminDeleteCommentAction(formData: FormData) {
  await requireAdminOrRedirect();

  const commentId = formData.get("commentId")?.toString();
  if (!commentId) {
    redirect("/admin/yorumlar?error=Yorum+bulunamadı");
  }

  try {
    await commentRepository.deleteComment(commentId);
    revalidatePath("/admin/yorumlar");
  } catch (e) {
    console.error("Admin delete comment error:", e);
  }

  redirect("/admin/yorumlar?success=Yorum+silindi");
}

export async function adminMarkSupportReadAction(formData: FormData) {
  await requireAdminOrRedirect();

  const messageId = formData.get("messageId")?.toString();
  const status = formData.get("status")?.toString();
  if (!messageId) {
    redirect("/admin/destek?error=Mesaj+bulunamadı");
  }
  if (status !== "new" && status !== "read" && status !== "archived") {
    redirect("/admin/destek?error=Geçersiz+durum");
  }

  try {
    await supportMessageRepository.updateStatus(messageId, { status });
    revalidatePath("/admin/destek");
  } catch (e) {
    console.error("Admin support status error:", e);
  }

  redirect(`/admin/destek/${messageId}?success=Durum+güncellendi`);
}

function parseAdminEvents(raw: FormDataEntryValue | null) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw.toString());
    if (!Array.isArray(parsed) || parsed.length !== 3) return null;
    return parsed.map((e) => ({
      year: typeof e?.year === "number" ? e.year : String(e?.year ?? "").slice(0, 8),
      title: String(e?.title ?? "").slice(0, 200),
      description: String(e?.description ?? "").slice(0, 2000),
    }));
  } catch {
    return null;
  }
}

export async function adminUpdateTarihteBugunAction(formData: FormData) {
  await requireAdminOrRedirect();

  const dateKey = formData.get("dateKey")?.toString();
  const events = parseAdminEvents(formData.get("events"));
  if (!dateKey || !events) {
    redirect("/admin/tarihte-bugun?error=Geçersiz+veri");
  }

  try {
    await tarihteBugunRepository.updateEvents(dateKey, events);
    revalidatePath("/tarihte-bugun");
    revalidatePath("/admin/tarihte-bugun");
  } catch (e) {
    console.error("Admin tarihte-bugun update error:", e);
    redirect("/admin/tarihte-bugun?error=Güncelleme+başarısız");
  }

  redirect("/admin/tarihte-bugun?success=İçerik+güncellendi");
}

export async function adminRegenerateTarihteBugunAction(formData: FormData) {
  await requireAdminOrRedirect();

  const dateKey = formData.get("dateKey")?.toString();
  if (!dateKey || !/^\d{2}-\d{2}$/.test(dateKey)) {
    redirect("/admin/tarihte-bugun?error=Geçersiz+tarih");
  }

  try {
    const [month, day] = dateKey.split("-");
    const dateStr = `${Number(day)} ${monthName(Number(month))} ${new Date().getFullYear()}`;
    const { events, rawText } = await generateTarihteBugunFromGemini(dateStr);

    const existing = await tarihteBugunRepository.findByDateKey(dateKey);
    if (existing) {
      await tarihteBugunRepository.regenerateWithAI(dateKey, events, rawText);
    } else {
      await tarihteBugunRepository.createOrUpsertEntry({
        dateKey,
        events,
        originalAIContent: rawText,
        generatedBy: "gemini",
      });
    }

    revalidatePath("/tarihte-bugun");
    revalidatePath("/admin/tarihte-bugun");
  } catch (e) {
    console.error("Admin tarihte-bugun regenerate error:", e);
    redirect("/admin/tarihte-bugun?error=AI+üretimi+başarısız");
  }

  redirect("/admin/tarihte-bugun?success=AI+içeriği+yeniden+oluşturuldu");
}

function monthName(month: number): string {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  return months[month - 1] ?? "";
}
