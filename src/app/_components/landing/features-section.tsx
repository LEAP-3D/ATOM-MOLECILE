"use client"

import { motion } from "framer-motion"
import {
  Upload,
  Sparkles,
  MousePointer2,
  History,
  Sun,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Upload & Visualize Instantly",
    description:
      "Drop your Excel files and see them transform into beautiful charts within seconds. No complex setup required.",
    gradient: "from-primary to-primary/50",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description:
      "Our intelligent system analyzes your data structure and recommends the most effective chart types automatically.",
    gradient: "from-secondary to-secondary/50",
  },
  {
    icon: MousePointer2,
    title: "Interactive & Animated",
    description:
      "Create engaging visualizations with smooth animations, hover effects, and interactive elements that captivate your audience.",
    gradient: "from-accent to-accent/50",
  },
  {
    icon: History,
    title: "Save & Revisit History",
    description:
      "All your created charts and uploaded files are automatically saved. Access your visualization history anytime.",
    gradient: "from-chart-4 to-chart-4/50",
  },
  {
    icon: Sun,
    title: "Dark & Light Optimized",
    description:
      "Every chart is designed to look stunning in both dark and light modes, ensuring perfect visuals in any environment.",
    gradient: "from-chart-5 to-chart-5/50",
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description:
      "Built with modern technology for blazing fast rendering, even with large datasets containing thousands of rows.",
    gradient: "from-primary to-secondary",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Tell Data Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make data visualization effortless and
            beautiful
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-xl glass overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}
                  />
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className={`absolute inset-[-1px] rounded-xl bg-gradient-to-r ${feature.gradient} opacity-30`}
                  />
                  <div className="absolute inset-[1px] rounded-xl bg-card" />
                </div>

                {/* Content */}
                <div className="relative">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
