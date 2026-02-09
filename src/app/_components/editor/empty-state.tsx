import { FileSpreadsheet, Loader2 } from "lucide-react";
import React from "react";

type EmptyStateProps = {
  icon: "file" | "loader";
  title: string;
  message: string;
};

const icons = {
  file: <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />,
  loader: <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />,
};

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-xl h-full">
      {icons[icon]}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
