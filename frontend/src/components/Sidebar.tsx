import { motion } from "framer-motion";

import type { Language } from "../lib/api";

type PlaylistItem = {
  id: string;
  lessonId: number;
  languageSlug: string;
  languageName: string;
  title: string;
  summary: string;
  orderIndex: number;
};

type Props = {
  languages: Language[];
  playlist: PlaylistItem[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  isLoading: boolean;
  playlistMode: "all" | "multi";
  onChangeMode: (mode: "all" | "multi") => void;
  selectedSlugs: string[];
  onToggleLanguage: (slug: string) => void;
};

export default function Sidebar({
  languages,
  playlist,
  selectedItemId,
  onSelectItem,
  isLoading,
  playlistMode,
  onChangeMode,
  selectedSlugs,
  onToggleLanguage
}: Props) {
  return (
    <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Playlist mode</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-3 py-1 text-xs transition ${
              playlistMode === "all"
                ? "border-ember/60 bg-ember/10 text-white"
                : "border-white/20 text-white/70 hover:border-white/50"
            }`}
            onClick={() => onChangeMode("all")}
          >
            All languages
          </button>
          <button
            className={`rounded-full border px-3 py-1 text-xs transition ${
              playlistMode === "multi"
                ? "border-ember/60 bg-ember/10 text-white"
                : "border-white/20 text-white/70 hover:border-white/50"
            }`}
            onClick={() => onChangeMode("multi")}
          >
            Multi-select
          </button>
        </div>
        {playlistMode === "multi" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language.id}
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
        ) : null}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Playlist</p>
        <p className="mt-2 text-xs text-white/60">
          Progress by topic: hello world, variables, control flow, functions.
        </p>
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Loading lessons...
            </div>
          ) : playlist.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Select a language to view lessons.
            </div>
          ) : (
            playlist.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition ${
                  selectedItemId === item.id ? "border-ember/50 shadow-glow" : "hover:border-white/30"
                }`}
                onClick={() => onSelectItem(item.id)}
              >
                <div>
                  <p className="text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/60">{item.languageName}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">#{item.orderIndex}</span>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
