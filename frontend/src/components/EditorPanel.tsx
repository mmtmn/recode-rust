import { AnimatePresence, motion } from "framer-motion";

import type { Challenge, Language, ValidationResult } from "../lib/api";

type Props = {
  challenge: Challenge | null;
  lessonTitle?: string | null;
  lessonSummary?: string | null;
  languageName?: string | null;
  languageSlug?: string | null;
  languages: Language[];
  code: string;
  onCodeChange: (value: string) => void;
  onValidate: () => void;
  onLanguageChange: (slug: string) => void;
  validation: ValidationResult | null;
  isValidating: boolean;
  successMessage?: string | null;
};

export default function EditorPanel({
  challenge,
  lessonTitle,
  lessonSummary,
  languageName,
  languageSlug,
  languages,
  code,
  onCodeChange,
  onValidate,
  onLanguageChange,
  validation,
  isValidating,
  successMessage
}: Props) {
  const showSuccess = Boolean(validation?.is_valid);
  const showError = Boolean(validation && !validation.is_valid);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 ${
        showSuccess ? "border-moss/60 shadow-glow" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Editor</p>
          <h3 className="font-display text-2xl text-white">{lessonTitle ?? "Select a lesson"}</h3>
        </div>
      </div>

      {challenge ? (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">Code</label>
              <select
                className="rounded-full border border-white/20 bg-ink/80 px-3 py-1 text-xs text-white/70"
                value={languageSlug ?? ""}
                onChange={(event) => onLanguageChange(event.target.value)}
              >
                {languages.map((language) => (
                  <option key={language.slug} value={language.slug}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="mt-2 h-56 w-full rounded-2xl border border-white/10 bg-ink/80 p-4 font-mono text-sm text-white/90 outline-none transition focus:border-ember/50"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              style={{ resize: "none" }}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  onValidate();
                  return;
                }
                if (event.key === "Tab") {
                  event.preventDefault();
                  const target = event.currentTarget;
                  const start = target.selectionStart ?? 0;
                  const end = target.selectionEnd ?? 0;
                  const updated = `${code.slice(0, start)}  ${code.slice(end)}`;
                  onCodeChange(updated);
                  window.requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="group relative inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2 text-xs font-semibold text-ink shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onValidate}
              disabled={isValidating}
            >
              <span className="h-2 w-2 rounded-full bg-ink/60 transition group-hover:scale-110" />
              {isValidating ? "Validating..." : "Validate Syntax"}
            </button>
            <span className="text-xs text-white/50">Tip: press Ctrl+Enter to run.</span>
            {showSuccess ? (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-moss"
              >
                {successMessage ?? "Looks good. Moving to the next activity."}
              </motion.span>
            ) : null}
            {showError ? (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-ember"
              >
                {validation?.errors[0] ?? "Syntax needs attention."}
              </motion.span>
            ) : null}
          </div>

          {showError ? (
            <div className="rounded-2xl border border-ember/40 bg-ember/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Correct syntax</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-ink/80 p-3 font-mono text-xs text-white/80">
                {challenge.solution_code}
              </pre>
              <p className="mt-2 text-xs text-white/60">Compare this reference with your attempt and try again.</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          Choose a lesson to open its syntax challenge.
        </div>
      )}

      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pointer-events-none absolute inset-0 rounded-3xl border border-moss/50 bg-moss/10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute right-6 top-6 rounded-full border border-moss/40 bg-moss/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-moss"
            >
              Success
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
