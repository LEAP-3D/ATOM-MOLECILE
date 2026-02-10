"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MiniChartPreview } from "./mini-chart-preview";

type ChartTypeCardProps = {
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  chartType: string;
};

export function ChartTypeCard({
  name,
  description,
  icon: Icon,
  gradient,
  chartType,
}: ChartTypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-xl glass overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-10`}
        />
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className={`absolute -inset-px rounded-xl bg-linear-to-r ${gradient} opacity-50`}
        />
        <div className="absolute inset-px rounded-xl bg-card" />
      </div>

      <div className="relative p-6">
        <div className="h-32 mb-4 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
          <MiniChartPreview chartType={chartType} gradient={gradient} />
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div
            className={`p-2 rounded-lg bg-linear-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <Link href={`/editor?type=${chartType}`}>
          <Button
            className={`w-full mt-4 bg-linear-to-r ${gradient} hover:opacity-90 transition-opacity text-primary-foreground`}
          >
            Create {name}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
