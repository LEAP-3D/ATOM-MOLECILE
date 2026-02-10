/* eslint-disable react-hooks/purity */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

type ChatInputProps = {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function ChatInput({ onSubmit, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const placeholderTexts = [
    "Сарын борлуулалтыг бүсчлэлээр харьцуулна уу...",
    "Жилийн өсөлтийг line chart-аар харуул...",
    "Топ 10 бүтээгдэхүүнийг bar chart-аар үзүүлнэ үү...",
    "Борлуулалтын хандлагыг area chart-аар дүрсэл...",
  ];

  const randomPlaceholder =
    placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Sparkles className="h-3 w-3" />
        AI Chart Analysis
      </div>

      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Эхлээд файл сонгоно уу..." : randomPlaceholder}
          disabled={isLoading || disabled}
          rows={4}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <motion.div
          className="absolute right-2 bottom-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading || disabled}
            className="h-9 w-9 rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 shadow-lg"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </div>

      {disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400"
        >
          <AlertCircle className="h-3 w-3" />
          <span>
            Chart үүсгэхийн тулд зүүн талаас файл сонгоно уу
          </span>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-primary flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-3 w-3" />
          </motion.div>
          <span>AI таны өгөгдлийг шинжилж байна...</span>
        </motion.div>
      )}
    </form>
  );
}