"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Map,
  TrendingUp,
  Activity,
} from "lucide-react";

const chartTypes = [
  {
    name: "Bar Chart",
    icon: BarChart3,
    color: "from-primary to-primary/50",
    description: "Compare categories",
  },
  {
    name: "Line Chart",
    icon: LineChart,
    color: "from-secondary to-secondary/50",
    description: "Track trends over time",
  },
  {
    name: "Area Chart",
    icon: AreaChart,
    color: "from-accent to-accent/50",
    description: "Show volume changes",
  },
  {
    name: "Pie Chart",
    icon: PieChart,
    color: "from-secondary to-chart-4/50",
    description: "Display proportions",
  },
  {
    name: "Scatter Plot",
    icon: ScatterChart,
    color: "from-primary to-chart-5/50",
    description: "Reveal correlations",
  },
  {
    name: "Map View",
    icon: Map,
    color: "from-primary to-secondary",
    description: "Geographic data",
  },
  {
    name: "Trend Analysis",
    icon: TrendingUp,
    color: "from-secondary to-accent",
    description: "Identify patterns",
  },
  {
    name: "Real-time",
    icon: Activity,
    color: "from-accent to-primary",
    description: "Live data streams",
  },
];

function ChartCard({ chart }: { chart: (typeof chartTypes)[0] }) {
  const Icon = chart.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative flex-shrink-0 w-48 h-32 rounded-xl glass neon-border overflow-hidden cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${chart.color} opacity-10`}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${chart.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm text-foreground">
          {chart.name}
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          {chart.description}
        </span>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-sm" />
      </div>
    </motion.div>
  );
}

export function ChartMarquee() {
  // Duplicate for seamless loop
  const duplicatedCharts = [...chartTypes, ...chartTypes];

  return (
    <section id="examples" className="py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Visualize Your Data, <span className="gradient-text">Your Way</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from a wide variety of chart types to perfectly represent
            your data story
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* First Row - Left to Right */}
        <div className="flex gap-6 mb-6 group">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            {duplicatedCharts.map((chart, index) => (
              <ChartCard key={`row1-${index}`} chart={chart} />
            ))}
          </motion.div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex gap-6 group">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            {duplicatedCharts.reverse().map((chart, index) => (
              <ChartCard key={`row2-${index}`} chart={chart} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
