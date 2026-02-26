// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SavedChartRow = Record<string, any>;

type InferredChartKeys = {
  labelKey: string | null;
  valueKey: string | null;
};

export type PreviewPoint = {
  label: string;
  value: number;
  index: number;
};

const PREVIEW_LIMIT = 12;

function isNumberLike(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") {
    return Number.isFinite(Number(value));
  }
  return false;
}

function isStringLike(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

function toOrderedKeys(rows: SavedChartRow[]): string[] {
  const keys: string[] = [];

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!keys.includes(key)) keys.push(key);
    }
  }

  return keys;
}

export function inferChartKeys(chartData: SavedChartRow[]): InferredChartKeys {
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return { labelKey: null, valueKey: null };
  }

  const sampledRows = chartData.slice(0, PREVIEW_LIMIT);
  const keys = toOrderedKeys(sampledRows);

  if (keys.length === 0) {
    return { labelKey: null, valueKey: null };
  }

  const labelKey =
    keys.find((key) => sampledRows.some((row) => isStringLike(row[key]))) ??
    keys[0] ??
    null;

  const valueKey =
    keys.find((key) => sampledRows.some((row) => isNumberLike(row[key]))) ??
    keys[1] ??
    keys[0] ??
    null;

  return { labelKey, valueKey };
}

export function normalizePreviewData(chartData: SavedChartRow[]): PreviewPoint[] {
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return [];
  }

  const { labelKey, valueKey } = inferChartKeys(chartData);
  if (!labelKey || !valueKey) {
    return [];
  }

  return chartData
    .slice(0, PREVIEW_LIMIT)
    .map((row, index) => {
      const rawLabel = row[labelKey];
      const rawValue = row[valueKey];
      const parsedValue = Number(rawValue);

      if (!Number.isFinite(parsedValue)) {
        return null;
      }

      const label =
        rawLabel === null || rawLabel === undefined || rawLabel === ""
          ? `Item ${index + 1}`
          : String(rawLabel);

      return {
        label,
        value: parsedValue,
        index: index + 1,
      };
    })
    .filter((point): point is PreviewPoint => point !== null);
}
