// // app/api/routes/generate-chart/utils/validate-config.ts

// export function parseChartConfig(generatedText: string, filesData: any[]) {
//   try {
//     // Remove markdown code blocks if Gemini included them
//     let cleanedText = generatedText
//       .trim()
//       .replace(/```json\n?/g, "")
//       .replace(/```\n?/g, "")
//       .trim();

//     return JSON.parse(cleanedText);
//   } catch (parseError) {
//     console.warn("⚠️ JSON parse failed, returning fallback config");
//     const firstFile = filesData[0];
//     return {
//       chartType: "bar",
//       xAxis: firstFile?.columns[0] || "",
//       yAxis: firstFile?.columns[1] || firstFile?.columns[0] || "",
//       title: "Generated Chart",
//       fileIndex: 0,
//     };
//   }
// }

// export function validateChartConfig(chartConfig: any, filesData: any[]) {
//   // Ensure fileIndex is a valid number within the array range
//   let index = parseInt(chartConfig.fileIndex);
//   if (isNaN(index) || index < 0 || index >= filesData.length) {
//     index = 0;
//   }
//   chartConfig.fileIndex = index;

//   const validFile = filesData[index];

//   // CRITICAL FIX: Check if validFile exists before accessing .columns
//   if (!validFile || !validFile.columns) {
//     throw new Error("Мэдээллийн сан эсвэл баганын мэдээлэл олдсонгүй.");
//   }

//   // Validate columns
//   if (!validFile.columns.includes(chartConfig.xAxis)) {
//     chartConfig.xAxis = validFile.columns[0];
//   }

//   if (!validFile.columns.includes(chartConfig.yAxis)) {
//     chartConfig.yAxis = validFile.columns[1] || validFile.columns[0];
//   }

//   const validTypes = ["bar", "line", "pie", "area", "scatter"];
//   if (!validTypes.includes(chartConfig.chartType)) {
//     chartConfig.chartType = "bar";
//   }

//   return chartConfig;
// }
