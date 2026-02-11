"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "../../ui/button";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function HeroContent() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Now with AI-Powered Chart Suggestions
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
        >
          Turn Raw Data into{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent">
            Interactive Stories
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
        >
          Create stunning, animated data visualizations in seconds. Upload your
          Excel files, let AI suggest the perfect charts, and bring your data to
          life.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SignedOut>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground px-8"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground px-8"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </SignedIn>

          <Link href="#examples">
            <Button
              size="lg"
              variant="outline"
              className="group neon-border hover:bg-primary/5 px-8 bg-transparent"
            >
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View Examples
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
