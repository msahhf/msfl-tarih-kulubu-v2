import "server-only";
import ImageKit from "imagekit";

function getImageKit() {
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
  });
}

/** Best-effort server-side ImageKit deletion (never throws). */
export async function deleteImageFromImageKit(fileId: string): Promise<void> {
  if (!fileId) return;
  try {
    await getImageKit().deleteFile(fileId);
  } catch (error) {
    console.error(`Görsel silinemedi (${fileId}):`, error);
  }
}

export async function deleteImagesFromImageKit(fileIds: string[]): Promise<void> {
  await Promise.all(fileIds.filter(Boolean).map((id) => deleteImageFromImageKit(id)));
}
