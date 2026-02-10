// app/api/routes/files/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    // Хэрэглэгчийн бүх файлуудыг авах
    const files = await prisma.uploadedFile.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        uploadedAt: "desc", // Сүүлд оруулсан файлыг эхэнд
      },
    });

    // UploadedFile type-д тохируулж буцаах
    const formattedFiles = files.map((file) => ({
      id: file.id.toString(),
      name: file.fileName,
      uploadDate: file.uploadedAt,
      data: file.content as Record<string, unknown>[],
      columns: file.content && Array.isArray(file.content) && file.content.length > 0
        ? Object.keys(file.content[0] as Record<string, unknown>)
        : [],
    }));

    return NextResponse.json({
      success: true,
      files: formattedFiles,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Файлуудыг татахад алдаа гарлаа";
    console.error("❌ Fetch files error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}