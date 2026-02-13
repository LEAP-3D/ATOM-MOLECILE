// app/api/routes/generate-chart/utils/fetch-files.ts
import prisma from "@/lib/prisma";

export type FormattedFile = {
  id: string;
  name: string;
  data: Record<string, unknown>[];
  columns: string[];
};

export async function fetchFilesFromSupabase(
  fileIds: Set<string>,
  userId: string
): Promise<FormattedFile[]> {
  console.log("📊 Fetching full data from Supabase...");

  const filesData = await prisma.uploadedFile.findMany({
    where: {
      id: { in: Array.from(fileIds).map((id) => BigInt(id)) },
      userId: userId,
    },
    select: {
      id: true,
      fileName: true,
      content: true,
    },
  });

  console.log("✅ Fetched files from Supabase:", filesData.length);

  if (filesData.length === 0) {
    throw new Error("Файлын өгөгдөл олдсонгүй");
  }

  return filesData.map((file) => {
    const content = file.content as Record<string, unknown>[];
    const columns = content.length > 0 ? Object.keys(content[0]) : [];

    return {
      id: file.id.toString(),
      name: file.fileName,
      data: content,
      columns,
    };
  });
}