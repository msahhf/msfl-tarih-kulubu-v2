import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import ImageKit from "imagekit";

function getImageKit() {
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { fileBase64, fileName, folder } = await request.json();

    if (!fileBase64 || !fileName) {
      return NextResponse.json({ error: "Eksik veri." }, { status: 400 });
    }

    if (!fileBase64.startsWith("data:image/")) {
      return NextResponse.json({ error: "Sadece görsel dosyalar yüklenebilir." }, { status: 400 });
    }

    const sizeInBytes = (fileBase64.length * 3) / 4 - (fileBase64.endsWith("==") ? 2 : 1);
    const MAX_SIZE = 6 * 1024 * 1024;

    if (sizeInBytes > MAX_SIZE) {
      return NextResponse.json({ error: "Görsel boyutu çok yüksek (Max 6MB)." }, { status: 400 });
    }

    const cleanBase64 = fileBase64.split(";base64,").pop();

    const buffer = Buffer.from(cleanBase64, "base64");

    if (buffer.length < 4) {
      return NextResponse.json({ error: "Dosya içeriği bozuk veya boş." }, { status: 400 });
    }

    const header = buffer.toString("hex", 0, 4);

    const isJpeg = header.startsWith("ffd8ff");
    const isPng = header === "89504e47";
    const isGif = header === "47494638";

    let isWebP = false;
    if (header === "52494646") {
      const type = buffer.toString("hex", 8, 12);
      if (type === "57454250") isWebP = true;
    }

    if (!isJpeg && !isPng && !isGif && !isWebP) {
      return NextResponse.json({ error: "Geçersiz veya bozuk resim dosyası." }, { status: 400 });
    }

    const imagekit = getImageKit();
    const result = await imagekit.upload({
      file: cleanBase64,
      fileName: fileName,
      folder: folder || "uploads",
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Yükleme sırasında sunucu hatası oluştu." }, { status: 500 });
  }
}
