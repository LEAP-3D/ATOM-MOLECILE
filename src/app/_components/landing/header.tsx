"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, BarChart3 } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // className={cn(
      //   "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center",
      //   isScrolled
      //     ? "glass-strong bg-transparent shadow-lg shadow-primary/5"
      //     : "bg-transparent",
      // )}
      className={cn(
        "left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center",
        isScrolled
          ? "fixed top-0 glass-strong bg-transparent backdrop-blur shadow-lg shadow-primary/5"
          : "relative bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="flex items-center justify-between">
          {/* Logo хэсэг */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-linear-to-r from-primary to-secondary p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
            </motion.div>
            <span className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent">
              DataViz Studio
            </span>
          </Link>

          {/* Navigation - Зөвхөн Desktop гэлтгүй шууд харагдахаар үлдээв */}
          <nav className="flex items-center gap-1">
            <Link
              href="#features"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#examples"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Examples
            </Link>

            <SignedIn>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>

            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                  Dashboard
                </button>
              </SignUpButton>
            </SignedOut>
          </nav>

          {/* Баруун талын үйлдлүүд */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            )}

            {/* Clerk Authentication */}
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-primary-foreground font-medium rounded-full px-5"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-9 w-9 border-2 border-primary/20",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
