"use client";

import React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Sparkles className="h-3 w-3" />
        Describe Your Analysis
      </div>

      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Compare monthly sales performance across regions..."
          disabled={isLoading || disabled}
          rows={3}
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
            className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50"
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
        <p className="text-xs text-muted-foreground">
          Upload an Excel file to start analyzing
        </p>
      )}
    </form>
  );
}
