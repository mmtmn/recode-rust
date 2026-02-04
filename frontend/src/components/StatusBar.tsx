import type { Progress } from "../lib/api";

type Props = {
  progress: Progress | null;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
};

export default function StatusBar({ progress, onOpenStats, onOpenAchievements }: Props) {
  const xp = progress?.xp ?? 0;
  const streak = progress?.streak ?? 0;
  const completed = progress?.completed_lessons ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">RECODE</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/50"
          onClick={onOpenStats}
        >
          Stats
        </button>
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/50"
          onClick={onOpenAchievements}
        >
          Achievements
        </button>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <p className="text-xs uppercase text-white/50">XP</p>
          <p className="text-lg text-white">{xp}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <p className="text-xs uppercase text-white/50">Streak</p>
          <p className="text-lg text-white">{streak} days</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <p className="text-xs uppercase text-white/50">Lessons</p>
          <p className="text-lg text-white">{completed}</p>
        </div>
      </div>
    </div>
  );
}
