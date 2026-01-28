"use client";
import type { FC } from "react";
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList
} from "recharts";
import { funnelData } from "./FunnelChartData";


export const FunnelChartComponent: FC = () => {
  return (
    <div className="w-full h-64 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        User Funnel Overview
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip />
          <Funnel
            dataKey="value"
            data={funnelData}
            isAnimationActive={true}
          >
            {/* Labels next to wedges */}
            <LabelList position="right" fill="#555" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};
