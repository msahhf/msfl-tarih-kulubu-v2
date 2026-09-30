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
    const { fileId } = await request.json();
    if (!fileId) {
      return NextResponse.json({ error: "fileId gerekli." }, { status: 400 });
    }

    const imagekit = getImageKit();
    await imagekit.deleteFile(fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
