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
};

export default function AchievementToast({ achievement }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="rounded-2xl border border-ember/50 bg-ember/10 p-4 text-white shadow-glow"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/20">
          {iconMap[achievement.icon] ?? "#"}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Achievement</p>
          <p className="font-display text-base text-white">{achievement.title}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-white/70">{achievement.description}</p>
    </motion.div>
  );
}
