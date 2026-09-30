import { z } from "zod";

const uploadedImageSchema = z.object({
  url: z.string().url("Geçersiz görsel URL"),
  fileId: z.string().min(1, "Geçersiz görsel ID"),
});

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalıdır")
    .max(200, "Başlık en fazla 200 karakter olmalıdır"),
  content: z
    .string()
    .trim()
    .min(10, "İçerik en az 10 karakter olmalıdır")
    .max(50000, "İçerik en fazla 50000 karakter olmalıdır"),
  images: z.array(uploadedImageSchema).max(5, "En fazla 5 görsel eklenebilir").default([]),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Yorum boş olamaz")
    .max(2000, "Yorum en fazla 2000 karakter olmalıdır"),
});

export type BlogInput = z.infer<typeof blogSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
