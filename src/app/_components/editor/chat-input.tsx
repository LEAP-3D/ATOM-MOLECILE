"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

type ChatInputProps = {
  onSubmit: (message: string) => Promise<{ description?: string } | void>;
  isLoading?: boolean;
  disabled?: boolean;
};

export function ChatInput({ onSubmit, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      const userMessage = message.trim();
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      const result = await onSubmit(userMessage);
      const description = result?.description?.trim();
      if (description) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: description },
        ]);
      }
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {" "}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        AI Chart Assistant
      </div>
      {messages.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "assistant"
                  ? "bg-muted/50 text-foreground"
                  : "bg-primary/10 text-foreground ml-auto"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
      )}
      <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-border bg-background/50 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Please select a file first..."}
          disabled={isLoading || disabled}
          rows={1}
          className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none resize-none min-h-10 max-h-50 overflow-y-auto custom-scrollbar"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "inherit";
            target.style.height = `${target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit(e);
            }
          }}
        />

        <motion.div
          className="shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading || disabled}
            className="h-9 w-9 rounded-xl bg-linear-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 shadow-lg"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
            ) : (
              <Send className="h-4 w-4 text-white" />
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
          <span>Please select a file to generate a chart</span>
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
          <span>AI is analyzing your data...</span>
        </motion.div>
      )}
    </form>
  );
}
