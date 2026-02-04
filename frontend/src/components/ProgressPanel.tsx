import { motion } from "framer-motion";

import type { Progress } from "../lib/api";

type Props = {
  progress: Progress | null;
};

export default function ProgressPanel({ progress }: Props) {
  const xp = progress?.xp ?? 0;
  const streak = progress?.streak ?? 0;
  const completed = progress?.completed_lessons ?? 0;
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const progressPercent = Math.min(100, Math.round((xpInLevel / 200) * 100));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Player Status</p>
          <p className="mt-2 font-display text-2xl text-white">Level {level}</p>
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <div>
            <p className="text-xs uppercase text-white/50">XP</p>
            <p className="text-lg text-white">{xp}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/50">Streak</p>
            <p className="text-lg text-white">{streak} days</p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/50">Lessons</p>
            <p className="text-lg text-white">{completed}</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Next level</span>
          <span>{xpInLevel}/200 XP</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white/10">
          <motion.div
            className="h-2 rounded-full bg-ember"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
}
