import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "../../../../../lib/prisma";
import { Prisma } from "@prisma/client"; // Prisma-ийн төрлүүдийг авах

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("files") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Excel-ээс ирсэн өгөгдлийг JSON болгох
    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // Prisma ашиглан хадгалах
    // jsonData-г Prisma.InputJsonValue руу хөрвүүлж ESLint алдааг засна
    const savedFile = await prisma.uploadedFile.create({
      data: {
        fileName: file.name,
        content: jsonData as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      message: "Амжилттай хадгалагдлаа",
      id: savedFile.id.toString(),
    });
  } catch (error: unknown) {
    // any-г арилгаж, аюулгүй байдлаар алдааг барих
    const errorMessage =
      error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа";
    console.error("Upload error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
