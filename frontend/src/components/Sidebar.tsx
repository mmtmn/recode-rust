import { motion } from "framer-motion";

import type { Language, Lesson } from "../lib/api";

type Props = {
  languages: Language[];
  selectedSlug: string;
  onSelectSlug: (slug: string) => void;
  lessons: Lesson[];
  selectedLessonId: number | null;
  onSelectLesson: (lessonId: number) => void;
  isLoading: boolean;
};

export default function Sidebar({
  languages,
  selectedSlug,
  onSelectSlug,
  lessons,
  selectedLessonId,
  onSelectLesson,
  isLoading
}: Props) {
  return (
    <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Language</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {languages.map((language) => (
            <button
              key={language.id}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                selectedSlug === language.slug
                  ? "border-ember/60 bg-ember/10 text-white"
                  : "border-white/20 text-white/70 hover:border-white/50"
              }`}
              onClick={() => onSelectSlug(language.slug)}
            >
              {language.name}
            </button>
          ))}
          {!isLoading && languages.length === 0 ? (
            <span className="text-xs text-white/60">No languages loaded.</span>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Playlist</p>
        <p className="mt-2 text-xs text-white/60">Start with fundamentals: hello world, variables, control flow, functions.</p>
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Loading lessons...
            </div>
          ) : lessons.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Select a language to view lessons.
            </div>
          ) : (
            lessons.map((lesson) => (
              <motion.button
                key={lesson.id}
                whileHover={{ x: 4 }}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition ${
                  selectedLessonId === lesson.id ? "border-ember/50 shadow-glow" : "hover:border-white/30"
                }`}
                onClick={() => onSelectLesson(lesson.id)}
              >
                <div>
                  <p className="text-sm text-white">{lesson.title}</p>
                  <p className="text-xs text-white/60">{lesson.summary}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{lesson.xp} XP</span>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
