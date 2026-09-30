"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { postRepository, commentRepository } from "@/lib/db/repositories";
import { blogSchema, commentSchema } from "@/lib/validation/blog";
import { deleteImagesFromImageKit } from "@/lib/services/imagekit";

function parseImages(raw: FormDataEntryValue | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw.toString());
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((img) => img?.url && img?.fileId)
      .slice(0, 5)
      .map((img) => ({
        url: String(img.url),
        fileId: String(img.fileId),
        provider: "imagekit" as const,
      }));
  } catch {
    return [];
  }
}

export async function createPostAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const validated = blogSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    images: parseImages(formData.get("imageUrls")),
  });

  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz form verisi"
    );
    redirect(`/blog/olustur?error=${message}`);
  }

  try {
    await postRepository.createPost({
      user_id: session._id as string,
      username: session.username,
      title: validated.data.title,
      content: validated.data.content,
      images: validated.data.images.map((img) => ({ ...img, provider: "imagekit" as const })),
    });
  } catch (e) {
    console.error("Create blog error:", e);
    redirect("/blog/olustur?error=Blog+oluşturulurken+bir+hata+oluştu");
  }

  redirect("/blog?success=Blog+başarıyla+oluşturuldu");
}

export async function updatePostAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const postId = formData.get("postId")?.toString();
  if (!postId) {
    redirect("/blog?error=Blog+bulunamadı");
  }

  const post = await postRepository.findById(postId);
  if (!post) {
    redirect("/blog?error=Blog+bulunamadı");
  }

  const isOwner = post.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";
  if (!isOwner && !isAdmin) {
    redirect("/blog?error=Bu+işlem+için+yetkiniz+yok");
  }

  const validated = blogSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    images: parseImages(formData.get("images")),
  });

  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz form verisi"
    );
    redirect(`/blog/duzenle/${postId}?error=${message}`);
  }

  // Remove images dropped in the editor from ImageKit (best-effort).
  const oldFileIds = (post.images || []).map((img) => img.fileId).filter(Boolean);
  const newFileIds = validated.data.images.map((img) => img.fileId);
  const removedFileIds = oldFileIds.filter((id) => !newFileIds.includes(id));

  try {
    if (removedFileIds.length > 0) {
      await deleteImagesFromImageKit(removedFileIds);
    }
    await postRepository.updatePost(postId, {
      title: validated.data.title,
      content: validated.data.content,
      images: validated.data.images.map((img) => ({ ...img, provider: "imagekit" as const })),
    });
  } catch (e) {
    console.error("Update post error:", e);
    redirect(`/blog/duzenle/${postId}?error=Güncelleme+başarısız`);
  }

  redirect(`/blog/${postId}?success=Blog+güncellendi`);
}

export async function deletePostAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const postId = formData.get("postId")?.toString();
  if (!postId) {
    redirect("/blog?error=Blog+bulunamadı");
  }

  const post = await postRepository.findById(postId);
  if (!post) {
    redirect("/blog?error=Blog+bulunamadı");
  }

  const isOwner = post.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";
  if (!isOwner && !isAdmin) {
    redirect("/blog?error=Yetkiniz+yok");
  }

  try {
    const fileIds = (post.images || []).map((img) => img.fileId).filter(Boolean);
    if (fileIds.length > 0) {
      await deleteImagesFromImageKit(fileIds);
    }
    await postRepository.deletePost(postId);
    await commentRepository.deleteCommentsByPostId(postId);
  } catch (e) {
    console.error("Delete post error:", e);
    redirect("/blog?error=Silme+işlemi+başarısız");
  }

  redirect("/blog?success=Blog+tamamen+silindi");
}

export async function addCommentAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const postId = formData.get("postId")?.toString();
  if (!postId) return;

  const validated = commentSchema.safeParse({
    content: formData.get("content")?.toString() ?? "",
  });
  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz yorum"
    );
    redirect(`/blog/${postId}?error=${message}#comments`);
  }

  try {
    const post = await postRepository.findById(postId);
    if (!post) {
      redirect("/blog?error=Blog+bulunamadı");
    }
    await commentRepository.createComment({
      post_id: postId,
      user_id: session._id as string,
      username: session.username,
      content: validated.data.content,
    });
  } catch (e) {
    console.error("Add comment error:", e);
    redirect(`/blog/${postId}?error=Yorum+eklenemedi#comments`);
  }

  redirect(`/blog/${postId}#comments`);
}

export async function updateCommentAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const commentId = formData.get("commentId")?.toString();
  const postId = formData.get("postId")?.toString();
  if (!commentId || !postId) return;

  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    redirect(`/blog/${postId}?error=Yorum+bulunamadı`);
  }

  const isOwner = comment.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";
  if (!isOwner && !isAdmin) {
    redirect(`/blog/${postId}?error=Yetkiniz+yok`);
  }

  const validated = commentSchema.safeParse({
    content: formData.get("content")?.toString() ?? "",
  });
  if (!validated.success) {
    const message = encodeURIComponent(
      validated.error.issues[0]?.message || "Geçersiz yorum"
    );
    redirect(`/blog/${postId}?error=${message}#comments`);
  }

  try {
    await commentRepository.updateComment(commentId, {
      content: validated.data.content,
    });
  } catch (e) {
    console.error("Update comment error:", e);
    redirect(`/blog/${postId}?error=Yorum+düzenlenemedi`);
  }

  redirect(`/blog/${postId}#comments`);
}

export async function deleteCommentAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const commentId = formData.get("commentId")?.toString();
  const postId = formData.get("postId")?.toString();
  if (!commentId || !postId) return;

  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    redirect(`/blog/${postId}#comments`);
  }

  const isOwner = comment.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";
  if (!isOwner && !isAdmin) return;

  try {
    await commentRepository.deleteComment(commentId);
  } catch (e) {
    console.error("Delete comment error:", e);
  }

  redirect(`/blog/${postId}#comments`);
}
