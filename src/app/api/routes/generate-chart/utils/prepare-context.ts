// app/api/routes/generate-chart/utils/prepare-context.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prepareDataContext(filesData: any[]): string {
  let dataContext = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filesData.forEach((file: any, index: number) => {
    dataContext += `\n\n=== Файл ${index + 1}: ${file.name} ===\n`;
    dataContext += `Баганууд: ${file.columns.join(", ")}\n`;
    dataContext += `Мөрийн тоо: ${file.data.length}\n`;
    dataContext += `\nЖишээ өгөгдөл (эхний 5 мөр):\n`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file.data.slice(0, 5).forEach((row: any, idx: number) => {
      dataContext += `${idx + 1}. ${JSON.stringify(row)}\n`;
    });

    // Статистик мэдээлэл нэмэх
    if (file.data.length > 0) {
      const numericalColumns = file.columns.filter((col: string) => {
        const sampleValue = file.data[0][col];
        return typeof sampleValue === "number" || !isNaN(Number(sampleValue));
      });

      if (numericalColumns.length > 0) {
        dataContext += `\nТоон баганууд: ${numericalColumns.join(", ")}\n`;
      }
    }
  });

  return dataContext;
}