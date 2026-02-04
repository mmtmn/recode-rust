import { motion } from "framer-motion";

import type { Language } from "../lib/api";

const iconMap: Record<string, string> = {
  snake: "PY",
  bolt: "JS",
  shield: "TS",
  cup: "JV",
  gear: "C++",
  spark: "C#",
  wind: "GO",
  anchor: "RS",
  database: "SQL"
};

type Props = {
  language: Language;
  isActive: boolean;
  onSelect: (slug: string) => void;
};

export default function LanguageCard({ language, isActive, onSelect }: Props) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition ${
        isActive ? "shadow-glow border-white/30" : "hover:border-white/20"
      }`}
      onClick={() => onSelect(language.slug)}
      style={{ background: `linear-gradient(135deg, ${language.color}20, transparent)` }}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">{iconMap[language.icon] ?? "LG"}</div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">Core</span>
      </div>
      <div>
        <p className="font-display text-xl text-white">{language.name}</p>
        <p className="mt-2 text-sm text-white/70">{language.description}</p>
      </div>
    </motion.button>
  );
}
