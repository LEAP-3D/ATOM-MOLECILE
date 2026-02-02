"use client";

import { Zap, Palette, Share2, Layers, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Instant Conversion",
    description:
      "Transform your Excel data into beautiful charts in seconds with our lightning-fast processing engine.",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: Palette,
    title: "Stunning Themes",
    description:
      "Choose from dozens of professionally designed color palettes and themes to match your brand.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Layers,
    title: "Multiple Chart Types",
    description:
      "Bar charts, line graphs, pie charts, scatter plots, and more. Find the perfect visualization for your data.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },

  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Generate shareable links or embed your interactive charts directly into websites and apps.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data never leaves your browser. We process everything locally for maximum privacy.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
              visualize data
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features that make data visualization simple, beautiful,
            and accessible to everyone.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "group relative p-8 rounded-3xl bg-card border border-border/50 transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20",
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
          feature.bgColor,
        )}
      >
        <Icon className={cn("w-7 h-7", feature.color)} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 text-foreground">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Hover accent */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-1 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3",
        )}
      />
    </div>
  );
}
