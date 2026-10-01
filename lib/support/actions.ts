"use server";

import { supportMessageRepository } from "@/lib/db/repositories";
import { getSession } from "@/lib/auth/session";
import { supportMessageSchema } from "@/lib/validation/support";

export interface SupportFormState {
  error?: string;
  success?: string;
}

/**
 * Yardım & Destek formu — /yardim-destek.
 * Herkese açıktır; oturum açıksa talep kullanıcı hesabıyla ilişkilendirilir.
 */
export async function createSupportMessageAction(
  _prevState: SupportFormState | null,
  formData: FormData
): Promise<SupportFormState> {
  const validated = supportMessageSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    topic: formData.get("topic")?.toString() || "Diğer",
    message: formData.get("message")?.toString() ?? "",
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Geçersiz form verisi" };
  }

  try {
    const session = await getSession();

    await supportMessageRepository.createMessage({
      name: validated.data.name,
      email: validated.data.email,
      topic: validated.data.topic,
      message: validated.data.message,
      ...(session ? { user_id: session._id as string } : {}),
    });

    return { success: "Mesajınız alındı. Kulüp yönetimi en kısa sürede inceleyecek." };
  } catch (error) {
    console.error("Support message error:", error);
    return { error: "Mesajınız gönderilemedi, lütfen daha sonra tekrar deneyin" };
  }
}
