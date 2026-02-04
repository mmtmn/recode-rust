import { motion } from "framer-motion";

const colors = ["#FF6B35", "#F4D35E", "#2A9D8F", "#2E86AB", "#F7F9FC"];

type Piece = {
  id: number;
  left: number;
  delay: number;
  rotate: number;
  drift: number;
  size: number;
  color: string;
};

export default function ConfettiBurst() {
  const pieces: Piece[] = Array.from({ length: 40 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 240,
    size: 6 + Math.random() * 8,
    color: colors[index % colors.length]
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 0, y: -40, x: 0, rotate: piece.rotate }}
          animate={{ opacity: 1, y: 520, x: piece.drift, rotate: piece.rotate + 180 }}
          transition={{ duration: 1.6, delay: piece.delay, ease: "easeOut" }}
          style={{ left: `${piece.left}%`, backgroundColor: piece.color, width: piece.size, height: piece.size * 0.5 }}
          className="absolute top-6 rounded-sm shadow-glow"
        />
      ))}
    </div>
  );
}
