import { motion } from "framer-motion";

import type { Achievement } from "../lib/api";

const iconMap: Record<string, string> = {
  spark: "*",
  map: "O",
  flame: "^",
  star: "#"
};

type Props = {
  achievement: Achievement;
  highlight?: boolean;
};

export default function AchievementBadge({ achievement, highlight }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 ${
        highlight ? "border-ember/60 shadow-glow" : ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
        {iconMap[achievement.icon] ?? "#"}
      </div>
      <div>
        <p className="font-display text-base text-white">{achievement.title}</p>
        <p className="text-sm text-white/70">{achievement.description}</p>
      </div>
    </motion.div>
  );
}
