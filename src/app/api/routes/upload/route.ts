import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "../../../../lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"; // ✅ Clerk нэмэв

export async function POST(req: Request) {
  try {
    // 1. Хэрэглэгчийн сессийг шалгах
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("files") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // 2. userId-г дамжуулж хүснэгтүүдийг холбох
    const savedFile = await prisma.uploadedFile.create({
      data: {
        fileName: file.name,
        content: jsonData as Prisma.InputJsonValue,
        userId: userId, // ✅ Хүснэгт хоорондын холболт
      },
    });

    return NextResponse.json({
      message: "Амжилттай хадгалагдлаа",
      id: savedFile.id.toString(),
    });
  } catch (error: unknown) {
    // ✅ 'any' ашиглахгүйгээр засав
    const errorMessage =
      error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа";
    console.error("Upload error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
