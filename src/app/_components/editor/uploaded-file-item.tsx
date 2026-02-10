import { motion } from "framer-motion";
import { FileSpreadsheet, Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { UploadedFile } from "./excel-upload";

type UploadedFileItemProps = {
  file: UploadedFile;
  onView: (file: UploadedFile) => void;
  onRemove: (id: string) => void;
};

export function UploadedFileItem({
  file,
  onView,
  onRemove,
}: UploadedFileItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-card group"
    >
      <div className="p-2 rounded-lg bg-green-500/10">
        <FileSpreadsheet className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {file.data.length} мөр • {file.columns.length} багана
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onView(file)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onRemove(file.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
