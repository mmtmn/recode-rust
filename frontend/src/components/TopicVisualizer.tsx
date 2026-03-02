import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  topicId: string;
};

type StepMeta = {
  label: string;
  note: string;
};

type GraphNodeId = "A" | "B" | "C" | "D" | "E" | "F";

function useLoopedStep(totalSteps: number, intervalMs: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (totalSteps <= 1) return;
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSteps);
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [totalSteps, intervalMs]);

  return index;
}

function boundedMarkerPercent(index: number, total: number) {
  const raw = ((index + 0.5) / total) * 100;
  return Math.min(96, Math.max(4, raw));
}

function StepCopy({ meta }: { meta: StepMeta }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={meta.label + meta.note}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember/85">{meta.label}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/65">{meta.note}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function VisualFrame({
  title,
  hint,
  stepMeta,
  stepIndex,
  totalSteps,
  children
}: {
  title: string;
  hint: string;
  stepMeta: StepMeta;
  stepIndex: number;
  totalSteps: number;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/75 p-3 sm:p-4">
      <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Visualizer</p>
          <p className="font-display text-base text-white">{title}</p>
        </div>
        <p className="text-[11px] leading-relaxed text-white/55 md:max-w-xs md:text-right">{hint}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3">
        <StepCopy meta={stepMeta} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-5 rounded-full transition ${idx === stepIndex ? "bg-ember/90" : "bg-white/15"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-3 h-[17rem] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:h-[18rem] md:h-[19rem]">
        <div className="absolute inset-0 p-2 sm:p-3">{children}</div>
      </div>
    </div>
  );
}

function BinarySearchVisualizer() {
  const values = [2, 5, 7, 11, 13, 17, 19, 23, 29];
  const target = 19;
  const steps = [
    {
      lo: 0,
      hi: 8,
      mid: 4,
      label: "Step 1: check middle",
      note: "Middle is 13, smaller than 19, so discard the left half."
    },
    {
      lo: 5,
      hi: 8,
      mid: 6,
      label: "Step 2: shrink range",
      note: "Search indices 5..8. Middle becomes 19."
    },
    {
      lo: 6,
      hi: 6,
      mid: 6,
      label: "Step 3: done",
      note: "Range collapsed to one index, which is the answer."
    }
  ] as const;
  const stepIndex = useLoopedStep(steps.length, 2200);
  const step = steps[stepIndex];

  const rangeLeft = (step.lo / values.length) * 100;
  const rangeWidth = ((step.hi - step.lo + 1) / values.length) * 100;
  const loPct = boundedMarkerPercent(step.lo, values.length);
  const hiPct = boundedMarkerPercent(step.hi, values.length);
  const midPct = boundedMarkerPercent(step.mid, values.length);

  return (
    <VisualFrame
      title="Binary search / search on answer"
      hint="Each check removes half of the remaining search space."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col">
        <div className="relative mt-8">
          <motion.div
            className="absolute -inset-y-1 rounded-md border border-ember/60 bg-ember/12"
            animate={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <div className="relative z-10 grid grid-cols-9 gap-1">
            {values.map((value, idx) => {
              const isMid = idx === step.mid;
              const isTarget = value === target;
              const inRange = idx >= step.lo && idx <= step.hi;
              return (
                <div
                  key={value}
                  className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold transition sm:h-10 ${
                    isMid
                      ? "border-dawn/70 bg-dawn/20 text-white"
                      : isTarget
                        ? "border-moss/60 bg-moss/15 text-white"
                        : inRange
                          ? "border-white/20 bg-white/[0.05] text-white/80"
                          : "border-white/10 bg-white/[0.02] text-white/35"
                  }`}
                >
                  {value}
                </div>
              );
            })}
          </div>

          <motion.span
            className="absolute -top-5 -translate-x-1/2 rounded border border-ocean/50 bg-ocean/20 px-1.5 py-0.5 text-[10px] text-white/85"
            animate={{ left: `${loPct}%` }}
            transition={{ duration: 0.4 }}
          >
            lo
          </motion.span>
          <motion.span
            className="absolute -top-5 -translate-x-1/2 rounded border border-moss/50 bg-moss/20 px-1.5 py-0.5 text-[10px] text-white/85"
            animate={{ left: `${hiPct}%` }}
            transition={{ duration: 0.4 }}
          >
            hi
          </motion.span>
          <motion.span
            className="absolute top-[2.65rem] -translate-x-1/2 rounded border border-dawn/50 bg-dawn/20 px-1.5 py-0.5 text-[10px] text-white/85 sm:top-[2.9rem]"
            animate={{ left: `${midPct}%` }}
            transition={{ duration: 0.4 }}
          >
            mid
          </motion.span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-3 text-[10px]">
          <span className="rounded-full border border-white/15 bg-ink/85 px-2 py-1 text-white/75">target = {target}</span>
          <span className="rounded-full border border-white/15 bg-ink/85 px-2 py-1 text-white/60">
            current range [{step.lo}, {step.hi}]
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}

function SlidingWindowVisualizer() {
  const values = [3, 1, 2, 6, 1, 1, 4];
  const limit = 8;
  const steps = [
    { left: 0, right: 0, sum: 3, label: "Step 1: expand", note: "Start with one element." },
    { left: 0, right: 2, sum: 6, label: "Step 2: expand", note: "Grow while sum stays valid." },
    { left: 0, right: 3, sum: 12, label: "Step 3: overflow", note: "Sum too large; must shrink from left." },
    { left: 2, right: 3, sum: 8, label: "Step 4: shrink", note: "Window valid again after moving left." },
    { left: 3, right: 5, sum: 8, label: "Step 5: continue", note: "Slide forward to check more windows." }
  ] as const;
  const stepIndex = useLoopedStep(steps.length, 2200);
  const step = steps[stepIndex];

  const rangeLeft = (step.left / values.length) * 100;
  const rangeWidth = ((step.right - step.left + 1) / values.length) * 100;
  const leftPct = boundedMarkerPercent(step.left, values.length);
  const rightPct = boundedMarkerPercent(step.right, values.length);

  return (
    <VisualFrame
      title="Two pointers / sliding window"
      hint="Right grows the window; left shrinks it to restore constraints."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col">
        <div className="relative mt-8">
          <motion.div
            className={`absolute -inset-y-1 rounded-md border ${
              step.sum > limit ? "border-ember/70 bg-ember/18" : "border-moss/70 bg-moss/18"
            }`}
            animate={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <div className="relative z-10 grid grid-cols-7 gap-1">
            {values.map((value, idx) => (
              <div
                key={`${value}-${idx}`}
                className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold sm:h-10 ${
                  idx >= step.left && idx <= step.right
                    ? "border-white/30 bg-white/[0.08] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/45"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
          <motion.span
            className="absolute -top-5 -translate-x-1/2 rounded border border-moss/50 bg-moss/20 px-1.5 py-0.5 text-[10px] text-white/85"
            animate={{ left: `${leftPct}%` }}
            transition={{ duration: 0.4 }}
          >
            L
          </motion.span>
          <motion.span
            className="absolute -top-5 -translate-x-1/2 rounded border border-ember/50 bg-ember/20 px-1.5 py-0.5 text-[10px] text-white/85"
            animate={{ left: `${rightPct}%` }}
            transition={{ duration: 0.4 }}
          >
            R
          </motion.span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-3 text-[10px]">
          <span className="rounded-full border border-white/15 bg-ink/85 px-2 py-1 text-white/75">sum = {step.sum}</span>
          <span className="rounded-full border border-white/15 bg-ink/85 px-2 py-1 text-white/60">limit = {limit}</span>
          <span className="rounded-full border border-white/15 bg-ink/85 px-2 py-1 text-white/60">
            window [{step.left}, {step.right}]
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}

const graphNodes: Record<GraphNodeId, { x: number; y: number }> = {
  A: { x: 12, y: 22 },
  B: { x: 34, y: 10 },
  C: { x: 34, y: 62 },
  D: { x: 58, y: 10 },
  E: { x: 58, y: 62 },
  F: { x: 84, y: 36 }
};

const graphEdges: Array<[GraphNodeId, GraphNodeId]> = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["C", "E"],
  ["D", "F"],
  ["E", "F"]
];

function TraversalPane({
  title,
  state,
  frontierName,
  accent
}: {
  title: string;
  state: { current: GraphNodeId; frontier: GraphNodeId[]; visited: GraphNodeId[] };
  frontierName: string;
  accent: "moss" | "ocean";
}) {
  const accentClass = accent === "moss" ? "border-moss/55 bg-moss/18" : "border-ocean/55 bg-ocean/18";
  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">{title}</p>
      <div className="relative mt-1 flex-1 min-h-[8rem]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none">
          {graphEdges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={graphNodes[a].x}
              y1={graphNodes[a].y}
              x2={graphNodes[b].x}
              y2={graphNodes[b].y}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {Object.entries(graphNodes).map(([node, pos]) => {
          const id = node as GraphNodeId;
          const isCurrent = state.current === id;
          const isVisited = state.visited.includes(id);
          return (
            <motion.div
              key={id}
              className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-semibold ${
                isCurrent
                  ? `${accentClass} text-white`
                  : isVisited
                    ? "border-white/30 bg-white/[0.12] text-white/85"
                    : "border-white/15 bg-ink/85 text-white/45"
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={isCurrent ? { scale: [1, 1.13, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, repeat: isCurrent ? Infinity : 0 }}
            >
              {id}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
        <span className="rounded-full border border-white/15 bg-ink/90 px-2 py-0.5 text-white/55">{frontierName}</span>
        {state.frontier.length === 0 ? (
          <span className="rounded-full border border-white/15 bg-ink/90 px-2 py-0.5 text-white/40">empty</span>
        ) : (
          state.frontier.map((node) => (
            <span key={node} className={`rounded-full border px-2 py-0.5 text-white/80 ${accentClass}`}>
              {node}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function GraphTraversalVisualizer() {
  const bfsStates = [
    { current: "A", frontier: ["B", "C"], visited: ["A"] },
    { current: "B", frontier: ["C", "D"], visited: ["A", "B"] },
    { current: "C", frontier: ["D", "E"], visited: ["A", "B", "C"] },
    { current: "D", frontier: ["E", "F"], visited: ["A", "B", "C", "D"] },
    { current: "E", frontier: ["F"], visited: ["A", "B", "C", "D", "E"] },
    { current: "F", frontier: [], visited: ["A", "B", "C", "D", "E", "F"] }
  ] as const;

  const dfsStates = [
    { current: "A", frontier: ["C", "B"], visited: ["A"] },
    { current: "B", frontier: ["C", "D"], visited: ["A", "B"] },
    { current: "D", frontier: ["C", "F"], visited: ["A", "B", "D"] },
    { current: "F", frontier: ["C", "E"], visited: ["A", "B", "D", "F"] },
    { current: "E", frontier: ["C"], visited: ["A", "B", "D", "F", "E"] },
    { current: "C", frontier: [], visited: ["A", "B", "D", "F", "E", "C"] }
  ] as const;

  const stepIndex = useLoopedStep(bfsStates.length, 2200);
  const bfs = bfsStates[stepIndex];
  const dfs = dfsStates[stepIndex];

  return (
    <VisualFrame
      title="DFS / BFS on graphs and trees"
      hint="BFS explores by layers (queue). DFS goes deep first (stack)."
      stepMeta={{
        label: `Step ${stepIndex + 1}: compare traversals`,
        note: `BFS visits ${bfs.current} while DFS visits ${dfs.current}.`
      }}
      stepIndex={stepIndex}
      totalSteps={bfsStates.length}
    >
      <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-2">
        <TraversalPane
          title="BFS (queue)"
          state={{ current: bfs.current, frontier: [...bfs.frontier], visited: [...bfs.visited] }}
          frontierName="queue"
          accent="moss"
        />
        <TraversalPane
          title="DFS (stack)"
          state={{ current: dfs.current, frontier: [...dfs.frontier], visited: [...dfs.visited] }}
          frontierName="stack"
          accent="ocean"
        />
      </div>
    </VisualFrame>
  );
}

function DynamicProgrammingVisualizer() {
  const fib = [0, 1, 1, 2, 3, 5, 8];
  const steps = [
    { upTo: 1, current: 1, refs: [] as number[], label: "Step 1: base cases", note: "Set dp[0] and dp[1]." },
    { upTo: 2, current: 2, refs: [0, 1], label: "Step 2: fill next", note: "dp[2] = dp[1] + dp[0]." },
    { upTo: 3, current: 3, refs: [1, 2], label: "Step 3: reuse", note: "Use solved states only once." },
    { upTo: 4, current: 4, refs: [2, 3], label: "Step 4: continue", note: "Build table from left to right." },
    { upTo: 6, current: 6, refs: [4, 5], label: "Step 5: complete", note: "All states are filled." }
  ] as const;

  const stepIndex = useLoopedStep(steps.length, 2300);
  const step = steps[stepIndex];

  return (
    <VisualFrame
      title="DP with memoization / tabulation"
      hint="Compute each state once and reuse previous answers."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col">
        <div className="mt-1 grid grid-cols-7 gap-1">
          {fib.map((value, idx) => {
            const computed = idx <= step.upTo;
            const isCurrent = idx === step.current;
            const isRef = step.refs.includes(idx);
            return (
              <div key={idx} className="space-y-1 text-center">
                <div className="text-[10px] text-white/45">i={idx}</div>
                <div
                  className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold sm:h-10 ${
                    isCurrent
                      ? "border-ember/65 bg-ember/20 text-white"
                      : isRef
                        ? "border-ocean/65 bg-ocean/18 text-white"
                        : computed
                          ? "border-moss/55 bg-moss/15 text-white/90"
                          : "border-white/10 bg-white/[0.02] text-white/35"
                  }`}
                >
                  {computed ? value : "?"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto rounded-lg border border-white/10 bg-ink/80 p-2 text-[11px] text-white/65">
          {step.current >= 2 ? (
            <span>
              dp[{step.current}] = dp[{step.current - 1}] + dp[{step.current - 2}] = {fib[step.current - 1]} +{" "}
              {fib[step.current - 2]} = {fib[step.current]}
            </span>
          ) : (
            <span>Memoization and tabulation avoid recomputing the same subproblem.</span>
          )}
        </div>
      </div>
    </VisualFrame>
  );
}

function buildGroups(nodeCount: number, links: Array<[number, number]>) {
  const parent = Array.from({ length: nodeCount }, (_, i) => i);

  const find = (x: number): number => {
    let cur = x;
    while (parent[cur] !== cur) {
      parent[cur] = parent[parent[cur]];
      cur = parent[cur];
    }
    return cur;
  };

  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  links.forEach(([a, b]) => unite(a, b));

  const groups = new Map<number, number[]>();
  for (let i = 0; i < nodeCount; i += 1) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(i);
  }
  return [...groups.values()];
}

function UnionFindTopoVisualizer() {
  const unionSteps = [
    { links: [] as Array<[number, number]>, op: "Start: each node is its own set." },
    { links: [[0, 1]] as Array<[number, number]>, op: "union(0,1) merges those nodes." },
    { links: [[0, 1], [2, 3]] as Array<[number, number]>, op: "union(2,3) creates a second set." },
    { links: [[0, 1], [2, 3], [1, 2]] as Array<[number, number]>, op: "union(1,2) merges both sets." },
    { links: [[0, 1], [2, 3], [1, 2], [4, 5]] as Array<[number, number]>, op: "union(4,5) adds another pair." },
    {
      links: [
        [0, 1],
        [2, 3],
        [1, 2],
        [4, 5],
        [3, 4]
      ] as Array<[number, number]>,
      op: "union(3,4) connects everything."
    }
  ] as const;

  const topoSteps = [
    { removed: [] as string[], queue: ["A", "B"] as string[], note: "Start with zero in-degree nodes." },
    { removed: ["A"] as string[], queue: ["B"] as string[], note: "Remove A and update indegrees." },
    { removed: ["A", "B"] as string[], queue: ["C"] as string[], note: "C becomes available now." },
    { removed: ["A", "B", "C"] as string[], queue: ["D", "E"] as string[], note: "Removing C unlocks D and E." },
    { removed: ["A", "B", "C", "D"] as string[], queue: ["E"] as string[], note: "Process D, then E remains." },
    { removed: ["A", "B", "C", "D", "E"] as string[], queue: [] as string[], note: "Ordering is complete." }
  ] as const;

  const stepIndex = useLoopedStep(unionSteps.length, 2400);
  const union = unionSteps[stepIndex];
  const topo = topoSteps[stepIndex];

  const groups = buildGroups(6, [...union.links]);
  const palette = ["#2A9D8F", "#2E86AB", "#FF6B35", "#F4D35E", "#9CA3AF"];
  const groupByNode = new Map<number, string>();
  groups.forEach((group, gIdx) => {
    group.forEach((node) => groupByNode.set(node, palette[gIdx % palette.length]));
  });

  const unionPos = [
    { x: 14, y: 20 },
    { x: 36, y: 20 },
    { x: 58, y: 20 },
    { x: 80, y: 20 },
    { x: 28, y: 62 },
    { x: 68, y: 62 }
  ];

  return (
    <VisualFrame
      title="Union Find / topological sort"
      hint="Union Find tracks connectivity; topological sort respects dependency order in DAGs."
      stepMeta={{
        label: `Step ${stepIndex + 1}: union + topo`,
        note: `${union.op} Queue now: [${topo.queue.join(", ") || "empty"}].`
      }}
      stepIndex={stepIndex}
      totalSteps={unionSteps.length}
    >
      <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-2">
        <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Union Find</p>
          <div className="relative mt-1 flex-1 min-h-[8rem]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none">
              {union.links.map(([a, b], idx) => (
                <motion.line
                  key={`${a}-${b}-${idx}`}
                  x1={unionPos[a].x}
                  y1={unionPos[a].y}
                  x2={unionPos[b].x}
                  y2={unionPos[b].y}
                  stroke="rgba(42,157,143,0.85)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </svg>

            {unionPos.map((pos, node) => (
              <div
                key={node}
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-semibold text-white"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  borderColor: groupByNode.get(node) ?? "rgba(255,255,255,0.2)",
                  background: `${groupByNode.get(node) ?? "#0B0F1A"}33`
                }}
              >
                {node}
              </div>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-white/60">components: {groups.map((g) => `[${g.join(",")}]`).join(" ")}</p>
        </div>

        <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Topological Sort</p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {["A", "B", "C", "D", "E"].map((node) => {
              const done = topo.removed.includes(node);
              const queued = topo.queue.includes(node);
              return (
                <div
                  key={node}
                  className={`flex h-8 items-center justify-center rounded-full border text-[10px] ${
                    done
                      ? "border-moss/55 bg-moss/20 text-white"
                      : queued
                        ? "border-ember/55 bg-ember/18 text-white"
                        : "border-white/15 bg-ink/85 text-white/45"
                  }`}
                >
                  {node}
                </div>
              );
            })}
          </div>
          <div className="mt-2 rounded-md border border-white/10 bg-ink/85 p-2 text-[10px] text-white/65">
            <div>order: {topo.removed.length > 0 ? topo.removed.join(" -> ") : "(none yet)"}</div>
            <div className="mt-1">queue: {topo.queue.join(", ") || "empty"}</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function HashMapVisualizer() {
  const steps = [
    {
      key: "cat",
      bucket: 1,
      buckets: [[], ["cat"], []],
      setValues: ["cat"],
      label: "Step 1: insert key",
      note: "Hash(cat) chooses bucket 1."
    },
    {
      key: "dog",
      bucket: 0,
      buckets: [["dog"], ["cat"], []],
      setValues: ["cat", "dog"],
      label: "Step 2: another key",
      note: "Hash(dog) chooses bucket 0."
    },
    {
      key: "tac",
      bucket: 1,
      buckets: [["dog"], ["cat", "tac"], []],
      setValues: ["cat", "dog", "tac"],
      label: "Step 3: collision",
      note: "tac collides with cat in bucket 1."
    },
    {
      key: "cat",
      bucket: 1,
      buckets: [["dog"], ["cat", "tac"], []],
      setValues: ["cat", "dog", "tac"],
      label: "Step 4: set uniqueness",
      note: "Set ignores duplicate cat."
    },
    {
      key: "eel",
      bucket: 2,
      buckets: [["dog"], ["cat", "tac"], ["eel"]],
      setValues: ["cat", "dog", "tac", "eel"],
      label: "Step 5: complete",
      note: "All buckets and set entries are ready."
    }
  ] as const;
  const stepIndex = useLoopedStep(steps.length, 2300);
  const step = steps[stepIndex];
  const bucketCenters = ["16.5%", "50%", "83.5%"] as const;

  return (
    <VisualFrame
      title="Hash map / hash set"
      hint="Hash maps place keys into buckets; hash sets keep only unique keys."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="relative flex-1 min-h-[8.5rem] rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <motion.div
            key={`${stepIndex}-${step.key}`}
            className="absolute top-1 flex h-7 w-14 -translate-x-1/2 items-center justify-center rounded border border-ocean/60 bg-ocean/20 text-[11px] font-semibold text-white"
            initial={{ left: "50%", opacity: 0, y: -8 }}
            animate={{ left: bucketCenters[step.bucket], opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            {step.key}
          </motion.div>

          <div className="absolute inset-x-2 bottom-2 grid grid-cols-3 gap-1.5">
            {step.buckets.map((bucket, idx) => (
              <div key={idx} className="rounded-md border border-white/12 bg-white/[0.04] p-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">bucket {idx}</p>
                <div className="mt-1 flex min-h-8 flex-wrap gap-1">
                  {bucket.length === 0 ? (
                    <span className="text-[10px] text-white/30">empty</span>
                  ) : (
                    bucket.map((value) => (
                      <span
                        key={value}
                        className="rounded-full border border-white/15 bg-ink/80 px-2 py-0.5 text-[10px] text-white/75"
                      >
                        {value}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-white/12 bg-ink/85 p-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">Hash set</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {step.setValues.map((value) => (
              <span key={value} className="rounded-full border border-moss/50 bg-moss/15 px-2 py-0.5 text-[10px] text-white/85">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function HeapVisualizer() {
  const steps = [
    { heap: [5], label: "Step 1: push 5", note: "Single value becomes root." },
    { heap: [3, 5], label: "Step 2: push 3", note: "3 sifts up above 5 in a min-heap." },
    { heap: [3, 5, 8], label: "Step 3: push 8", note: "8 stays as a child; heap property holds." },
    { heap: [1, 3, 8, 5], label: "Step 4: push 1", note: "1 bubbles up to root." },
    { heap: [1, 3, 8, 5, 6], label: "Step 5: push 6", note: "Parent <= children still true." },
    { heap: [3, 5, 8, 6], label: "Step 6: pop root", note: "Remove min, move last to root, reheapify." }
  ] as const;

  const nodePos = [
    { x: 50, y: 12 },
    { x: 30, y: 34 },
    { x: 70, y: 34 },
    { x: 18, y: 58 },
    { x: 42, y: 58 },
    { x: 58, y: 58 },
    { x: 82, y: 58 }
  ];

  const stepIndex = useLoopedStep(steps.length, 2300);
  const step = steps[stepIndex];

  return (
    <VisualFrame
      title="Heap / priority queue"
      hint="The root always stores the highest-priority item (min here)."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex-1 min-h-[8.5rem]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 72" preserveAspectRatio="none">
            {step.heap.map((_, idx) => {
              const left = idx * 2 + 1;
              const right = idx * 2 + 2;
              return (
                <g key={idx}>
                  {left < step.heap.length ? (
                    <line
                      x1={nodePos[idx].x}
                      y1={nodePos[idx].y}
                      x2={nodePos[left].x}
                      y2={nodePos[left].y}
                      stroke="rgba(255,255,255,0.24)"
                      strokeWidth="1.5"
                    />
                  ) : null}
                  {right < step.heap.length ? (
                    <line
                      x1={nodePos[idx].x}
                      y1={nodePos[idx].y}
                      x2={nodePos[right].x}
                      y2={nodePos[right].y}
                      stroke="rgba(255,255,255,0.24)"
                      strokeWidth="1.5"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {step.heap.map((value, idx) => (
            <motion.div
              key={`${idx}-${value}`}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-semibold ${
                idx === 0
                  ? "border-ember/70 bg-ember/25 text-white"
                  : "border-white/20 bg-ink/90 text-white/85"
              }`}
              style={{ left: `${nodePos[idx].x}%`, top: `${nodePos[idx].y}%` }}
              animate={idx === 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.9, repeat: idx === 0 ? Infinity : 0 }}
            >
              {value}
            </motion.div>
          ))}
        </div>

        <div className="mt-1 rounded-md border border-white/10 bg-ink/85 p-2 text-[10px] text-white/65">
          array form: [{step.heap.join(", ")}]
        </div>
      </div>
    </VisualFrame>
  );
}

function StackVisualizer() {
  const input = [2, 1, 2, 4, 3];
  const steps = [
    {
      idx: 0,
      stack: [0],
      next: [null, null, null, null, null] as Array<number | null>,
      label: "Step 1: push first",
      note: "Push index 0."
    },
    {
      idx: 1,
      stack: [0, 1],
      next: [null, null, null, null, null] as Array<number | null>,
      label: "Step 2: push",
      note: "1 is smaller, so stack remains monotonic."
    },
    {
      idx: 2,
      stack: [0, 2],
      next: [null, 2, null, null, null] as Array<number | null>,
      label: "Step 3: pop resolved",
      note: "2 resolves next-greater for index 1."
    },
    {
      idx: 3,
      stack: [3],
      next: [4, 2, 4, null, null] as Array<number | null>,
      label: "Step 4: pop many",
      note: "4 resolves multiple previous indices."
    },
    {
      idx: 4,
      stack: [3, 4],
      next: [4, 2, 4, null, null] as Array<number | null>,
      label: "Step 5: push tail",
      note: "3 cannot pop 4, so push."
    },
    {
      idx: 4,
      stack: [3, 4],
      next: [4, 2, 4, -1, -1] as Array<number | null>,
      label: "Step 6: finalize",
      note: "Remaining stack has no next greater."
    }
  ] as const;
  const stepIndex = useLoopedStep(steps.length, 2200);
  const step = steps[stepIndex];

  return (
    <VisualFrame
      title="Stack / monotonic stack"
      hint="Each index is pushed once and popped once, yielding linear time."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="grid grid-cols-5 gap-1">
          {input.map((value, idx) => (
            <div
              key={idx}
              className={`flex h-9 items-center justify-center rounded-md border text-xs sm:h-10 ${
                idx === step.idx
                  ? "border-ember/65 bg-ember/18 text-white"
                  : "border-white/15 bg-white/[0.04] text-white/75"
              }`}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="rounded-md border border-white/10 bg-ink/85 p-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">monotonic stack (index:value)</p>
          <div className="mt-1 flex min-h-7 flex-wrap gap-1">
            {step.stack.map((index) => (
              <span key={index} className="rounded-full border border-ocean/50 bg-ocean/18 px-2 py-0.5 text-[10px] text-white/80">
                {index}:{input[index]}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-md border border-white/10 bg-ink/85 p-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">next greater result</p>
          <div className="mt-1 grid grid-cols-5 gap-1">
            {step.next.map((value, idx) => (
              <div
                key={idx}
                className="flex h-7 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-[10px] text-white/75"
              >
                {value === null ? "?" : value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function TrieVisualizer() {
  const nodes = {
    root: { x: 12, y: 36 },
    c: { x: 32, y: 22 },
    a: { x: 52, y: 22 },
    r: { x: 76, y: 12 },
    t: { x: 76, y: 32 },
    d: { x: 32, y: 54 },
    o: { x: 52, y: 54 },
    g: { x: 76, y: 54 }
  } as const;
  type TrieNodeId = keyof typeof nodes;

  const edges: Array<[TrieNodeId, TrieNodeId]> = [
    ["root", "c"],
    ["c", "a"],
    ["a", "r"],
    ["a", "t"],
    ["root", "d"],
    ["d", "o"],
    ["o", "g"]
  ];

  const steps = [
    {
      activePath: ["root", "c"] as TrieNodeId[],
      builtNodes: ["root", "c"] as TrieNodeId[],
      words: [] as string[],
      label: "Step 1: start word",
      note: "Begin path for 'car'."
    },
    {
      activePath: ["root", "c", "a"] as TrieNodeId[],
      builtNodes: ["root", "c", "a"] as TrieNodeId[],
      words: [] as string[],
      label: "Step 2: shared prefix",
      note: "Continue the prefix branch."
    },
    {
      activePath: ["root", "c", "a", "r"] as TrieNodeId[],
      builtNodes: ["root", "c", "a", "r"] as TrieNodeId[],
      words: ["car"] as string[],
      label: "Step 3: mark terminal",
      note: "Word 'car' is now complete."
    },
    {
      activePath: ["root", "c", "a", "t"] as TrieNodeId[],
      builtNodes: ["root", "c", "a", "r", "t"] as TrieNodeId[],
      words: ["car", "cat"] as string[],
      label: "Step 4: branch",
      note: "Only one extra node needed for 'cat'."
    },
    {
      activePath: ["root", "d", "o"] as TrieNodeId[],
      builtNodes: ["root", "c", "a", "r", "t", "d", "o"] as TrieNodeId[],
      words: ["car", "cat"] as string[],
      label: "Step 5: new root branch",
      note: "Start a new branch for 'dog'."
    },
    {
      activePath: ["root", "d", "o", "g"] as TrieNodeId[],
      builtNodes: ["root", "c", "a", "r", "t", "d", "o", "g"] as TrieNodeId[],
      words: ["car", "cat", "dog"] as string[],
      label: "Step 6: complete",
      note: "Trie stores all words with shared prefixes."
    }
  ] as const;

  const stepIndex = useLoopedStep(steps.length, 2300);
  const step = steps[stepIndex];
  const activeEdgeSet = new Set(step.activePath.slice(1).map((node, idx) => `${step.activePath[idx]}->${node}`));

  return (
    <VisualFrame
      title="Trie"
      hint="Prefixes share nodes, so repeated prefixes cost almost nothing."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex-1 min-h-[8.5rem]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none">
            {edges.map(([from, to]) => {
              const edgeKey = `${from}->${to}`;
              const active = activeEdgeSet.has(edgeKey);
              return (
                <line
                  key={edgeKey}
                  x1={nodes[from].x}
                  y1={nodes[from].y}
                  x2={nodes[to].x}
                  y2={nodes[to].y}
                  stroke={active ? "rgba(255,107,53,0.95)" : "rgba(255,255,255,0.2)"}
                  strokeWidth={active ? 2.6 : 1.5}
                />
              );
            })}
          </svg>

          {Object.entries(nodes).map(([id, pos]) => {
            const nodeId = id as TrieNodeId;
            const built = step.builtNodes.includes(nodeId);
            const active = step.activePath.includes(nodeId);
            return (
              <motion.div
                key={id}
                className={`absolute flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-2 text-[10px] ${
                  active
                    ? "border-ember/70 bg-ember/22 text-white"
                    : built
                      ? "border-moss/55 bg-moss/15 text-white/90"
                      : "border-white/15 bg-ink/85 text-white/45"
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
              >
                {id}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-1 rounded-md border border-white/10 bg-ink/85 p-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">stored words</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {step.words.length === 0 ? (
              <span className="text-[10px] text-white/35">(none yet)</span>
            ) : (
              step.words.map((word) => (
                <span key={word} className="rounded-full border border-white/15 bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/75">
                  {word}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function FenwickVisualizer() {
  const bitValues = [2, 3, 4, 10, 5, 6, 2, 24];
  const steps = [
    {
      mode: "update",
      active: 5,
      touched: [5],
      path: [] as number[],
      partial: null as number | null,
      label: "Step 1: update idx=5",
      note: "Add delta to bit[5]."
    },
    {
      mode: "update",
      active: 6,
      touched: [5, 6],
      path: [] as number[],
      partial: null as number | null,
      label: "Step 2: lowbit jump",
      note: "Move 5 -> 6 and update."
    },
    {
      mode: "update",
      active: 8,
      touched: [5, 6, 8],
      path: [] as number[],
      partial: null as number | null,
      label: "Step 3: lowbit jump again",
      note: "Move 6 -> 8 and update."
    },
    {
      mode: "query",
      active: 7,
      touched: [5, 6, 8],
      path: [7],
      partial: 2,
      label: "Step 4: prefix(7)",
      note: "Start with bit[7]."
    },
    {
      mode: "query",
      active: 6,
      touched: [5, 6, 8],
      path: [7, 6],
      partial: 8,
      label: "Step 5: move left",
      note: "7 -> 6 and accumulate."
    },
    {
      mode: "query",
      active: 4,
      touched: [5, 6, 8],
      path: [7, 6, 4],
      partial: 18,
      label: "Step 6: move left again",
      note: "6 -> 4 yields final sum."
    }
  ] as const;

  const stepIndex = useLoopedStep(steps.length, 2200);
  const step = steps[stepIndex];

  return (
    <VisualFrame
      title="Segment tree / Fenwick tree"
      hint="Lowbit jumps touch only logarithmic nodes for updates and prefix queries."
      stepMeta={{ label: step.label, note: step.note }}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="grid grid-cols-8 gap-1">
          {bitValues.map((value, idx) => {
            const i = idx + 1;
            const isTouched = step.touched.includes(i);
            const isPath = step.path.includes(i);
            const isActive = step.active === i;
            return (
              <div key={i} className="space-y-1 text-center">
                <div className="text-[10px] text-white/45">{i}</div>
                <div
                  className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold sm:h-10 ${
                    isActive
                      ? "border-ember/65 bg-ember/20 text-white"
                      : isPath
                        ? "border-ocean/65 bg-ocean/18 text-white"
                        : isTouched
                          ? "border-moss/60 bg-moss/16 text-white"
                          : "border-white/12 bg-white/[0.03] text-white/70"
                  }`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto rounded-md border border-white/10 bg-ink/85 p-2 text-[10px] text-white/65">
          {step.mode === "update" ? (
            <span>Update path: {step.touched.join(" -> ")} (touching only ancestors)</span>
          ) : (
            <span>
              Query path: {step.path.join(" -> ")} | partial sum = {step.partial}
            </span>
          )}
        </div>
      </div>
    </VisualFrame>
  );
}

function fallbackMeta(topicId: string): StepMeta {
  return {
    label: "Visualizer unavailable",
    note: `No animation configured for "${topicId}" yet.`
  };
}

function FallbackVisualizer({ topicId }: { topicId: string }) {
  const meta = useMemo(() => fallbackMeta(topicId), [topicId]);
  return (
    <VisualFrame
      title="Visualizer unavailable"
      hint="Add a dedicated visual sequence for this topic."
      stepMeta={meta}
      stepIndex={0}
      totalSteps={1}
    >
      <div className="flex h-full items-center justify-center text-xs text-white/60">Missing visualizer: {topicId}</div>
    </VisualFrame>
  );
}

export default function TopicVisualizer({ topicId }: Props) {
  switch (topicId) {
    case "binary-search-answer":
      return <BinarySearchVisualizer />;
    case "two-pointers-sliding-window":
      return <SlidingWindowVisualizer />;
    case "dfs-bfs-graphs-trees":
      return <GraphTraversalVisualizer />;
    case "dp-memo-tab":
      return <DynamicProgrammingVisualizer />;
    case "union-find-topological-sort":
      return <UnionFindTopoVisualizer />;
    case "hash-map-hash-set":
      return <HashMapVisualizer />;
    case "heap-priority-queue":
      return <HeapVisualizer />;
    case "stack-monotonic-stack":
      return <StackVisualizer />;
    case "trie":
      return <TrieVisualizer />;
    case "segment-tree-fenwick":
      return <FenwickVisualizer />;
    default:
      return <FallbackVisualizer topicId={topicId} />;
  }
}
