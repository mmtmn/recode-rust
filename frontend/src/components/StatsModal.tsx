import { motion } from "framer-motion";
import { useMemo } from "react";

import type { AttemptRead, BestScoreRead, Language } from "../lib/api";

const formatMs = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centiseconds = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
};

type Props = {
  mode: "history" | "best";
  onChangeMode: (mode: "history" | "best") => void;
  attempts: AttemptRead[];
  bestScores: BestScoreRead[];
  languages: Language[];
  selectedSlugs: string[];
  onToggleLanguage: (slug: string) => void;
  onSelectAll: () => void;
  onClose: () => void;
};

export default function StatsModal({
  mode,
  onChangeMode,
  attempts,
  bestScores,
  languages,
  selectedSlugs,
  onToggleLanguage,
  onSelectAll,
  onClose
}: Props) {
  const filteredAttempts = useMemo(
    () => attempts.filter((item) => selectedSlugs.includes(item.language_slug)),
    [attempts, selectedSlugs]
  );
  const filteredBest = useMemo(
    () => bestScores.filter((item) => selectedSlugs.includes(item.language_slug)),
    [bestScores, selectedSlugs]
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/80 px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-ink/95 p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Stats</p>
            <h3 className="font-display text-2xl text-white">
              {mode === "history" ? "Historical attempts" : "Best scores"}
            </h3>
          </div>
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/50"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-3 py-1 text-xs transition ${
              mode === "history"
                ? "border-ember/60 bg-ember/10 text-white"
                : "border-white/20 text-white/70 hover:border-white/50"
            }`}
            onClick={() => onChangeMode("history")}
          >
            Historical attempts
          </button>
          <button
            className={`rounded-full border px-3 py-1 text-xs transition ${
              mode === "best"
                ? "border-ember/60 bg-ember/10 text-white"
                : "border-white/20 text-white/70 hover:border-white/50"
            }`}
            onClick={() => onChangeMode("best")}
          >
            Best scores
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/50"
            onClick={onSelectAll}
          >
            All languages
          </button>
          {languages.map((language) => (
            <button
              key={language.slug}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                selectedSlugs.includes(language.slug)
                  ? "border-moss/60 bg-moss/10 text-white"
                  : "border-white/20 text-white/70 hover:border-white/50"
              }`}
              onClick={() => onToggleLanguage(language.slug)}
            >
              {language.name}
            </button>
          ))}
        </div>

        <div className="mt-5 max-h-[50vh] overflow-y-auto pr-2">
          {mode === "history" ? (
            <div className="space-y-3">
              {filteredAttempts.map((attempt) => (
                <div
                  key={`${attempt.lesson_id}-${attempt.created_at}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-sm text-white">
                      {attempt.lesson_title} · {attempt.language_name}
                    </p>
                    <p className="text-xs text-white/60">{new Date(attempt.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{formatMs(attempt.duration_ms)}</p>
                    <p className={`text-xs ${attempt.is_correct ? "text-moss" : "text-ember"}`}>
                      {attempt.is_correct ? "Correct" : "Incorrect"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBest.map((score) => (
                <div
                  key={`${score.lesson_id}-${score.language_slug}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-sm text-white">
                      {score.lesson_title} · {score.language_name}
                    </p>
                    <p className="text-xs text-white/60">Best time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{formatMs(score.best_duration_ms)}</p>
                    <p className="text-xs text-white/60">{new Date(score.achieved_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
