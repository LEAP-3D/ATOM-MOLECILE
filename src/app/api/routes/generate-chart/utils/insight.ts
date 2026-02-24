// ./utils/insight.ts
type Row = Record<string, unknown>;

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export type InsightResult = {
  insight: string;
  bullets: string[];
};

export function generateInsight(args: {
  chartData: Row[];
  xAxisKey: string;
  yAxisKey: string;
  chartType: "bar" | "line" | "area" | "pie" | "scatter";
  title?: string;
}): InsightResult {
  const { chartData, xAxisKey, yAxisKey, chartType } = args;

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return { insight: "Өгөгдөл олдсонгүй.", bullets: [] };
  }

  // Бар/пай дээр: тархалт, давамгай бүлэг, тэнцүү эсэх
  if (chartType === "bar" || chartType === "pie") {
    const rows = chartData
      .map((r) => ({
        x: String(r[xAxisKey] ?? ""),
        y: toNumber(r[yAxisKey]),
      }))
      .filter((r) => r.x.length > 0);

    if (rows.length === 0) {
      return { insight: "Өгөгдөл тайлбарлахад хангалтгүй байна.", bullets: [] };
    }

    const sorted = [...rows].sort((a, b) => b.y - a.y);
    const max = sorted[0];
    const min = sorted[sorted.length - 1];
    const allEqual = sorted.every((r) => r.y === max.y);

    if (allEqual) {
      return {
        insight:
          "Ангиллуудын утгууд ойролцоогоор тэнцүү байна. Давамгай бүлэг ажиглагдсангүй.",
        bullets: [
          `Нийт ангилал: ${rows.length}`,
          `Бүгд ижил утгатай: ${max.y}`,
        ],
      };
    }

    return {
      insight: `${max.x} хамгийн өндөр (${max.y}), харин ${min.x} хамгийн бага (${min.y}) байна.`,
      bullets: [
        `Нийт ангилал: ${rows.length}`,
        `Хамгийн өндөр: ${max.x} (${max.y})`,
        `Хамгийн бага: ${min.x} (${min.y})`,
      ],
    };
  }

  // Line/area: trend (эхний ба сүүлийн утгаар)
  if (chartType === "line" || chartType === "area") {
    const rows = chartData
      .map((r) => ({
        x: r[xAxisKey],
        y: toNumber(r[yAxisKey]),
      }))
      .filter((r) => r.x !== undefined);

    if (rows.length < 2) {
      return { insight: "Trend тодорхойлоход дата бага байна.", bullets: [] };
    }

    const first = rows[0];
    const last = rows[rows.length - 1];
    const delta = last.y - first.y;

    const direction =
      delta > 0 ? "өссөн" : delta < 0 ? "буурсан" : "өөрчлөгдөөгүй";

    return {
      insight: `Эхнээс сүүл хүртэл нийтдээ ${direction} хандлага ажиглагдаж байна.`,
      bullets: [`Эхлэл: ${first.y}`, `Сүүлийн утга: ${last.y}`],
    };
  }

  // Scatter: correlation-г энгийн байдлаар (placeholder)
  return {
    insight:
      "Scatter өгөгдөл дээр нарийвчилсан хамаарлыг тооцоолох боломжтой (корреляци гэх мэт).",
    bullets: [`Нийт цэгийн тоо: ${chartData.length}`],
  };
}
