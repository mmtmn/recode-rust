import { motion } from "framer-motion";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centiseconds = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
}

type Props = {
  elapsedMs: number;
  variant?: "default" | "large";
};

export default function TimerDisplay({ elapsedMs, variant = "default" }: Props) {
  const isLarge = variant === "large";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`rounded-2xl border border-white/10 bg-white/5 px-6 ${isLarge ? "py-4" : "py-3"}`}>
        <p className={`uppercase tracking-[0.3em] text-white/50 ${isLarge ? "text-xs" : "text-[10px]"}`}>
          Timer
        </p>
        <p className={`mt-1 font-mono text-white ${isLarge ? "text-3xl" : "text-2xl"}`}>
          {formatTime(elapsedMs)}
        </p>
      </div>
    </motion.div>
  );
}
