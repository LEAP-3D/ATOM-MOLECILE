import { motion } from "framer-motion";

const stats = [
  { label: "Charts Created", value: "111" },
  { label: "Files Uploaded", value: "023232" },
  { label: "Saved Templates", value: "0000000" },
  { label: "Recent Views", value: "69966969" },
];

export function StatsCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl glass neon-border text-center"
        >
          <div className="text-2xl font-bold gradient-text">{stat.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
