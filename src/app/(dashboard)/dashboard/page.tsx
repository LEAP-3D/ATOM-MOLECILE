"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
  Map,
} from "lucide-react";
import { ChartTypeCard } from "@/app/_components/dashboard/chart-type-card";

const chartTypes = [
  {
    name: "Bar Chart",
    description:
      "Compare values across categories with vertical or horizontal bars",
    icon: BarChart3,
    gradient: "from-primary to-primary/50",
    chartType: "bar",
  },
  {
    name: "Line Chart",
    description:
      "Track trends and changes over time with connected data points",
    icon: LineChart,
    gradient: "from-secondary to-secondary/50",
    chartType: "line",
  },
  {
    name: "Area Chart",
    description: "Show cumulative data and volume changes with filled areas",
    icon: AreaChart,
    gradient: "from-accent to-accent/50",
    chartType: "area",
  },
  {
    name: "Pie Chart",
    description: "Display proportions and percentages of a whole dataset",
    icon: PieChart,
    gradient: "from-chart-4 to-chart-4/50",
    chartType: "pie",
  },
  {
    name: "Scatter Plot",
    description: "Reveal correlations and patterns between two variables",
    icon: ScatterChart,
    gradient: "from-chart-5 to-chart-5/50",
    chartType: "scatter",
  },
  {
    name: "Map View",
    description: "Visualize geographic data with interactive map overlays",
    icon: Map,
    gradient: "from-primary to-secondary",
    chartType: "map",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="gradient-text">DataViz Studio</span>
        </h1>
        <p className="text-muted-foreground">
          Choose a chart type to start creating beautiful visualizations
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "Charts Created", value: "0" },
          { label: "Files Uploaded", value: "0" },
          { label: "Saved Templates", value: "0" },
          { label: "Recent Views", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl glass neon-border text-center"
          >
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Chart Types Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Chart Types</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartTypes.map((chart, index) => (
            <motion.div
              key={chart.chartType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ChartTypeCard {...chart} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
