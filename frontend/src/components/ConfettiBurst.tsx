import { motion } from "framer-motion";

const colors = ["#FF6B35", "#F4D35E", "#2A9D8F", "#2E86AB"];

export default function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: colors[index % colors.length]
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 400 }}
          transition={{ duration: 1.2, delay: piece.delay }}
          style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
          className="absolute top-10 h-3 w-2 rounded-sm"
        />
      ))}
    </div>
  );
}
