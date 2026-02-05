// app/api/routes/upload/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { rowToText, getHashEmbedding } from "@/lib/embeddings.simple";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
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
    ) as Record<string, unknown>[];

    // console.log(`📊 ${jsonData.length} мөр уншигдлаа`);

    const savedFile = await prisma.uploadedFile.create({
      data: {
        fileName: file.name,
        content: jsonData as Prisma.InputJsonValue,
        userId: userId,
      },
    });

    // console.log(`✅ Supabase хадгалагдлаа: ${savedFile.id}`);

    try {
      const apiKey = process.env.PINECONE_API_KEY;
      const indexHost = process.env.PINECONE_INDEX_HOST;

      if (!apiKey) {
        throw new Error("PINECONE_API_KEY байхгүй байна");
      }

      if (!indexHost) {
        throw new Error(
          "PINECONE_INDEX_HOST байхгүй байна (.env файлд нэмнэ үү)"
        );
      }

      const allVectors = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const text = rowToText(row);

        // console.log(`📝 Мөр ${i + 1}: ${text.substring(0, 50)}...`);

        const embedding = getHashEmbedding(text);

        if (!embedding || embedding.length !== 384) {
          console.error(`❌ Мөр ${i}: Embedding алдаатай`);
          continue;
        }

        const cleanMetadata: Record<string, string | number | boolean> = {
          fileId: savedFile.id.toString(),
          userId: userId,
          fileName: file.name,
          rowIndex: i,
          text: text.substring(0, 1000),
        };

        for (const [key, value] of Object.entries(row)) {
          if (value !== null && value !== undefined) {
            if (typeof value === "string") {
              cleanMetadata[key] = value.substring(0, 500);
            } else if (typeof value === "number") {
              cleanMetadata[key] = value;
            } else if (typeof value === "boolean") {
              cleanMetadata[key] = value;
            } else {
              cleanMetadata[key] = String(value).substring(0, 500);
            }
          }
        }

        allVectors.push({
          id: `file_${savedFile.id}_row_${i}`,
          values: embedding,
          metadata: cleanMetadata,
        });
      }

      console.log(`✅ Нийт ${allVectors.length} vector бэлтгэгдлээ`);

      const BATCH_SIZE = 100;

      for (let i = 0; i < allVectors.length; i += BATCH_SIZE) {
        const batch = allVectors.slice(i, i + BATCH_SIZE);

        if (batch.length > 0) {
          console.log(`🔄 ${batch.length} vector илгээж байна...`);

          const response = await fetch(`https://${indexHost}/vectors/upsert`, {
            method: "POST",
            headers: {
              "Api-Key": apiKey,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              vectors: batch,
              namespace: "",
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Pinecone API алдаа: ${response.status} - ${errorText}`
            );
          }

          const result = await response.json();
          console.log(`✅ ${batch.length} vector амжилттай хадгалагдлаа`);
          console.log(
            `📊 Upsert count: ${result.upsertedCount || batch.length}`
          );
        }
      }

      console.log(
        `✅ Нийт ${allVectors.length} vector Pinecone-д хадгалагдлаа`
      );
    } catch (pineconeError) {
      console.error("⚠️ Pinecone алдаа:", pineconeError);
      if (pineconeError instanceof Error) {
        console.error("Мессеж:", pineconeError.message);
      }
    }

    return NextResponse.json({
      message: "Амжилттай хадгалагдлаа",
      id: savedFile.id.toString(),
      rowCount: jsonData.length,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа";
    console.error("❌ Upload алдаа:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
