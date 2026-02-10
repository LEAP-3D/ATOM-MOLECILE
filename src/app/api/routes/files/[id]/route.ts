// app/api/routes/files/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ← Promise болгох
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    const { id: fileId } = await params; // ← await params

    // Файл олдож байгаа эсэх болон хэрэглэгчийнх эсэхийг шалгах
    const file = await prisma.uploadedFile.findFirst({
      where: {
        id: BigInt(fileId),
        userId: userId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "Файл олдсонгүй эсвэл таны файл биш байна" },
        { status: 404 }
      );
    }

    // Database-аас устгах
    await prisma.uploadedFile.delete({
      where: {
        id: BigInt(fileId),
      },
    });

    // 🆕 Pinecone-аас холбоотой векторуудыг устгах (optional)
    try {
      const apiKey = process.env.PINECONE_API_KEY;
      const indexHost = process.env.PINECONE_INDEX_HOST;

      if (apiKey && indexHost) {
        // Энэ файлтай холбоотой бүх векторуудыг устгах
        // Pinecone-ийн delete by metadata filter ашиглах
        await fetch(`https://${indexHost}/vectors/delete`, {
          method: "POST",
          headers: {
            "Api-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              fileId: { $eq: fileId },
            },
            namespace: "",
          }),
        });
      }
    } catch (pineconeError) {
      console.error("⚠️ Pinecone устгахад алдаа:", pineconeError);
      // Pinecone алдаа гарсан ч үргэлжлүүлэх
    }

    return NextResponse.json({
      success: true,
      message: "Файл амжилттай устгагдлаа",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Файл устгахад алдаа гарлаа";
    console.error("❌ Delete file error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}