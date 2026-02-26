// ./utils/insight.ts
type Row = Record<string, unknown>;

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function average(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function stdDev(nums: number[], mean: number): number {
  if (!nums.length) return 0;
  const variance =
    nums.reduce((sum, value) => sum + (value - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
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

  // Scatter: Pearson correlation + энгийн outlier detection
  const points = chartData
    .map((r) => ({ x: Number(r[xAxisKey]), y: Number(r[yAxisKey]) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

  if (points.length < 2) {
    return {
      insight: "Корреляци тооцоолоход хангалттай цэг алга.",
      bullets: [`Нийт цэгийн тоо: ${points.length}`],
    };
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const meanX = average(xs);
  const meanY = average(ys);
  const sdX = stdDev(xs, meanX);
  const sdY = stdDev(ys, meanY);

  let cov = 0;
  for (let i = 0; i < points.length; i += 1) {
    cov += (points[i].x - meanX) * (points[i].y - meanY);
  }
  cov /= points.length;

  const denom = sdX * sdY;
  const r = denom === 0 ? 0 : cov / denom;

  const absR = Math.abs(r);
  const relationText =
    absR >= 0.7
      ? r > 0
        ? "Хүчтэй эерэг хамаарал ажиглагдаж байна"
        : "Хүчтэй сөрөг хамаарал ажиглагдаж байна"
      : absR >= 0.4
        ? r > 0
          ? "Дунд зэрэг эерэг хамаарал ажиглагдаж байна"
          : "Дунд зэрэг сөрөг хамаарал ажиглагдаж байна"
        : absR >= 0.2
          ? r > 0
            ? "Сул эерэг хамаарал ажиглагдаж байна"
            : "Сул сөрөг хамаарал ажиглагдаж байна"
          : "Бараг хамааралгүй байна";

  const zThreshold = 3;
  const outlierCount = points.filter((p) => {
    if (sdX === 0 || sdY === 0) return false;
    const zx = (p.x - meanX) / sdX;
    const zy = (p.y - meanY) / sdY;
    return Math.sqrt(zx * zx + zy * zy) > zThreshold;
  }).length;

  return {
    insight: `${relationText} (Pearson r = ${r.toFixed(3)}).`,
    bullets: [
      `Нийт цэг: ${points.length}`,
      `Pearson r: ${r.toFixed(3)}`,
      `Сэжигтэй outlier цэг: ${outlierCount}`,
    ],
  };
}
