"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Briefcase, GraduationCap } from "lucide-react";

const audiences = [
  {
    icon: Sparkles,
    title: "Designers",
    description: "Create visually stunning data presentations",
  },
  {
    icon: Users,
    title: "Analysts",
    description: "Transform complex data into clear insights",
  },
  {
    icon: Briefcase,
    title: "Startups",
    description: "Impress investors with professional visuals",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Elevate your research and presentations",
  },
];

export function IntroSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The Modern Way to{" "}
              <span className="gradient-text">Visualize Data</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              DataViz Studio is a next-generation data visualization platform
              that combines the power of AI with beautiful, interactive charts.
              Simply upload your Excel files, describe what you want to analyze,
              and watch as your data transforms into compelling visual stories.
            </p>
            <p className="text-muted-foreground text-pretty">
              Whether you are preparing a board presentation, analyzing market
              trends, or sharing research findings, our platform helps you
              communicate data effectively with animations, interactivity, and
              stunning design.
            </p>
          </motion.div>

          {/* Right - Audience Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <motion.div
                  key={audience.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group p-6 rounded-xl glass neon-border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {audience.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {audience.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
