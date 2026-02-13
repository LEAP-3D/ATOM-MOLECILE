// app/api/routes/generate-chart/utils/prepare-data-context.ts
import type { FormattedFile } from "./fetch-files";

export function prepareDataContext(
  query: string,
  formattedFiles: FormattedFile[]
): string {
  let dataContext = `Хэрэглэгчийн асуулт: ${query}\n\n`;
  dataContext += "Холбоотой өгөгдөл:\n\n";

  formattedFiles.forEach((file, index) => {
    dataContext += `=== Файл ${index + 1}: ${file.name} ===\n`;
    dataContext += `Баганууд: ${file.columns.join(", ")}\n`;
    dataContext += `Мөрийн тоо: ${file.data.length}\n`;
    dataContext += `Жишээ өгөгдөл (эхний 10 мөр):\n`;

    file.data.slice(0, 10).forEach((row, idx) => {
      dataContext += `${idx + 1}. ${JSON.stringify(row)}\n`;
    });
    dataContext += "\n";
  });

  return dataContext;
}