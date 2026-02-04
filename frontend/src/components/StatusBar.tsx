import type { Progress } from "../lib/api";

type Props = {
  progress: Progress | null;
  activeLanguage?: string | null;
};

export default function StatusBar({ progress, activeLanguage }: Props) {
  const xp = progress?.xp ?? 0;
  const streak = progress?.streak ?? 0;
  const completed = progress?.completed_lessons ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Recode</p>
        <h1 className="mt-2 font-display text-3xl text-white">Developer Syntax Studio</h1>
        <p className="mt-2 max-w-xl text-sm text-white/60">
          Practice core syntax with explicit examples, instant feedback, and structured playlists.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-white/70">
        {activeLanguage ? (
          <div className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
            {activeLanguage}
          </div>
        ) : null}
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
