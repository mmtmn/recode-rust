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
};

export default function TimerDisplay({ elapsedMs }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Timer</p>
        <p className="mt-2 font-mono text-3xl text-white">{formatTime(elapsedMs)}</p>
      </div>
    </motion.div>
  );
}
