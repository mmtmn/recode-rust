import { motion } from "framer-motion";

import type { Lesson } from "../lib/api";

type Props = {
  lesson: Lesson;
  onSelect: (lessonId: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export default function LessonRow({ lesson, onSelect, disabled, active }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 ${
        active ? "border-ember/50 shadow-glow" : ""
      }`}
    >
      <div>
        <p className="font-display text-lg text-white">{lesson.title}</p>
        <p className="text-sm text-white/60">{lesson.summary}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {lesson.difficulty}
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {lesson.xp} XP
        </div>
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onSelect(lesson.id)}
          disabled={disabled}
        >
          Practice
        </button>
      </div>
    </motion.div>
  );
}
