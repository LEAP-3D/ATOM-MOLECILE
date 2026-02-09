import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

type SidebarHeaderProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary whitespace-nowrap overflow-hidden"
            >
              DataViz Studio
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
