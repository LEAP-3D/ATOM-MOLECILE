import type { FC } from "react";
import type { TaskDataItem } from "../types";
import { MoreHorizontal } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type TaskProgressChartProps = {
  data: TaskDataItem[];
};

export const TaskProgressChart: FC<TaskProgressChartProps> = ({ data }) => {
  return (
    <div
      className="
        w-full max-w-[350px]
        rounded-2xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        p-5
        shadow-lg
        hover:border-emerald-400/40
        hover:shadow-emerald-400/20
        transition
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">
            Performance
          </h3>
          <p className="text-xs text-gray-400">
            Neon green analytics
          </p>
        </div>
        <button className="p-1 rounded-lg hover:bg-white/10 transition">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="text-gray-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_#84cc16]" />
          <span className="text-gray-400">Previous</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {/* Neon Emerald */}
              <linearGradient id="neonEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>

              {/* Neon Lime */}
              <linearGradient id="neonLime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#E5E7EB",
                fontSize: 12,
              }}
              cursor={{
                stroke: "#34d399",
                strokeOpacity: 0.35,
              }}
            />

            {/* Previous */}
            <Area
              type="monotone"
              dataKey="value2"
              stroke="#84cc16"
              strokeWidth={2}
              fill="url(#neonLime)"
            />

            {/* Current */}
            <Area
              type="monotone"
              dataKey="value1"
              stroke="#34d399"
              strokeWidth={3}
              fill="url(#neonEmerald)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
