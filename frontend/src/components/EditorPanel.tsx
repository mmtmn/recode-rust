import { motion } from "framer-motion";

import type { Challenge, ValidationResult } from "../lib/api";

type Props = {
  challenge: Challenge | null;
  code: string;
  onCodeChange: (value: string) => void;
  onValidate: () => void;
  validation: ValidationResult | null;
  isValidating: boolean;
};

export default function EditorPanel({
  challenge,
  code,
  onCodeChange,
  onValidate,
  validation,
  isValidating
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Syntax Lab</p>
          <h3 className="font-display text-2xl text-white">
            {challenge ? challenge.title : "Select a lesson"}
          </h3>
        </div>
        <div className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">Prototype</div>
      </div>

      {challenge ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/80">{challenge.prompt}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">Tests</p>
            <p className="mt-1 text-sm text-white/60">{challenge.tests}</p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-white/40">Editor</label>
            <textarea
              className="mt-2 h-44 w-full rounded-2xl border border-white/10 bg-ink/70 p-4 font-mono text-sm text-white/90 outline-none transition focus:border-ember/50"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-ember px-5 py-2 text-xs font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onValidate}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Validate Syntax"}
            </button>
            {validation ? (
              validation.is_valid ? (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-moss"
                >
                  Syntax looks good. XP is awarded on first pass.
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-ember"
                >
                  {validation.errors[0] ?? "Syntax needs attention."}
                </motion.span>
              )
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          Choose a lesson to open its syntax challenge.
        </div>
      )}
    </div>
  );
}
