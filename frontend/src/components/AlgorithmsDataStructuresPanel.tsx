import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Language } from "../lib/api";
import { getTopicSnippet, learningGroups, type LearningTopic } from "../lib/algorithmsCatalog";
import TimerDisplay from "./TimerDisplay";
import TopicVisualizer from "./TopicVisualizer";

type Props = {
  languages: Language[];
  activeLanguageSlug: string;
  onChangeLanguage: (slug: string) => void;
};

type TopicWithGroup = LearningTopic & {
  groupId: "algorithms" | "data-structures";
  groupTitle: string;
};

type PracticeResult = {
  isValid: boolean;
  message: string;
};

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const cardContainerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28 } }
};

const normalize = (value: string) => value.replace(/\s+/g, "");

export default function AlgorithmsDataStructuresPanel({ languages, activeLanguageSlug, onChangeLanguage }: Props) {
  const activeLanguage = languages.find((lang) => lang.slug === activeLanguageSlug) ?? languages[0] ?? null;
  const isSqlLanguage = activeLanguage?.slug === "sql";
  const focusRef = useRef<HTMLDivElement | null>(null);

  const topics = useMemo<TopicWithGroup[]>(
    () =>
      learningGroups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          groupId: group.id,
          groupTitle: group.title
        }))
      ),
    []
  );

  const [focusedTopicId, setFocusedTopicId] = useState<string>(topics[0]?.id ?? "");
  const [attemptByKey, setAttemptByKey] = useState<Record<string, string>>({});
  const [resultByKey, setResultByKey] = useState<Record<string, PracticeResult | null>>({});
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    if (topics.length === 0) return;
    if (topics.some((topic) => topic.id === focusedTopicId)) return;
    setFocusedTopicId(topics[0].id);
  }, [topics, focusedTopicId]);

  const focusedTopic = useMemo(
    () => topics.find((topic) => topic.id === focusedTopicId) ?? topics[0] ?? null,
    [topics, focusedTopicId]
  );

  const attemptKey = focusedTopic && activeLanguage ? `${focusedTopic.id}:${activeLanguage.slug}` : "";
  const referenceSnippet =
    focusedTopic && activeLanguage ? getTopicSnippet(focusedTopic, activeLanguage.slug) : "";
  const attemptCode = attemptByKey[attemptKey] ?? "";
  const practiceResult = resultByKey[attemptKey] ?? null;

  useEffect(() => {
    if (timerStart === null) return;
    const interval = window.setInterval(() => {
      setElapsedMs(performance.now() - timerStart);
    }, 50);
    return () => window.clearInterval(interval);
  }, [timerStart]);

  useEffect(() => {
    setTimerStart(null);
    setElapsedMs(0);
    setIsSubmitting(false);
  }, [focusedTopic?.id, activeLanguage?.slug]);

  useEffect(() => {
    if (!copyStatus) return;
    const timeout = window.setTimeout(() => setCopyStatus(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const handleFocusTopic = (topicId: string) => {
    setFocusedTopicId(topicId);
    focusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToggleTimer = () => {
    setTimerEnabled((prev) => {
      const next = !prev;
      if (!next) {
        setTimerStart(null);
        setElapsedMs(0);
      }
      return next;
    });
  };

  const handleAttemptChange = (value: string) => {
    if (!attemptKey) return;
    if (timerEnabled && timerStart === null && value.trim().length > 0) {
      setTimerStart(performance.now());
    }
    setAttemptByKey((prev) => ({ ...prev, [attemptKey]: value }));
    setResultByKey((prev) => ({ ...prev, [attemptKey]: null }));
  };

  const handleCopyReference = async () => {
    if (!referenceSnippet) return;
    try {
      await navigator.clipboard.writeText(referenceSnippet);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed");
    }
  };

  const handleSubmitAttempt = () => {
    if (!attemptKey || !focusedTopic || !activeLanguage) return;
    setIsSubmitting(true);

    const trimmed = attemptCode.trim();
    const durationMs = timerStart === null ? elapsedMs : Math.max(1, performance.now() - timerStart);
    setElapsedMs(durationMs);
    setTimerStart(null);

    if (!trimmed) {
      setResultByKey((prev) => ({
        ...prev,
        [attemptKey]: { isValid: false, message: "Write an implementation before submitting." }
      }));
      setIsSubmitting(false);
      return;
    }

    const matchesReference = normalize(trimmed) === normalize(referenceSnippet);
    if (matchesReference) {
      setResultByKey((prev) => ({
        ...prev,
        [attemptKey]: { isValid: true, message: "Submission accepted. Great work." }
      }));
    } else {
      setResultByKey((prev) => ({
        ...prev,
        [attemptKey]: {
          isValid: false,
          message: isBlindMode
            ? "Not matching yet. Turn off Test mode to compare with the gray reference."
            : "Not matching the reference yet. Compare and retry."
        }
      }));
    }

    setIsSubmitting(false);
  };

  return (
    <motion.div
      key="algorithms-and-data-structures"
      className="algo-shell rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
      initial={{ opacity: 0, scale: 0.985, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">New section</p>
            <h2 className="font-display text-3xl text-white md:text-4xl">Algorithms and Data Structures</h2>
            <p className="mt-3 text-sm text-white/75">
              Click any topic to focus it. You can practice, run the timer, hide the gray reference in test mode, and
              submit your attempt.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/50">Snippet language</label>
            <select
              className="mt-2 w-full rounded-xl border border-white/20 bg-ink/80 px-3 py-2 text-sm text-white outline-none transition focus:border-ember/60"
              value={activeLanguage?.slug ?? ""}
              onChange={(event) => onChangeLanguage(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language.slug} value={language.slug}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {languages.map((language) => (
            <button
              key={language.slug}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                (activeLanguage?.slug ?? "") === language.slug
                  ? "border-ember/60 bg-ember/15 text-white shadow-glow"
                  : "border-white/20 text-white/70 hover:border-white/50"
              }`}
              onClick={() => onChangeLanguage(language.slug)}
              type="button"
            >
              {language.name}
            </button>
          ))}
        </div>

        {isSqlLanguage ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-dawn/40 bg-dawn/10 px-4 py-3 text-xs text-white/80"
          >
            SQL examples here are conceptual mappings for understanding patterns. Core DS internals are usually built
            in application languages, not inside SQL itself.
          </motion.div>
        ) : null}

        <div ref={focusRef} className="mt-8">
          <AnimatePresence mode="wait">
            {focusedTopic ? (
              <motion.article
                key={focusedTopic.id}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 md:p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/45">Focused topic</p>
                    <h3 className="mt-1 font-display text-2xl text-white">{focusedTopic.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/75">{focusedTopic.explanation}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full border border-white/20 bg-ink/50 px-3 py-1 text-white/75">
                      {focusedTopic.groupTitle}
                    </span>
                    <span className="rounded-full border border-moss/50 bg-moss/10 px-3 py-1 text-white/85">
                      Time: {focusedTopic.complexity.time}
                    </span>
                    <span className="rounded-full border border-ocean/50 bg-ocean/10 px-3 py-1 text-white/85">
                      Space: {focusedTopic.complexity.space}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)]">
                  <div className="min-w-0">
                    <TopicVisualizer topicId={focusedTopic.id} />
                  </div>

                  <div className="min-w-0 rounded-2xl border border-white/10 bg-ink/75 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Practice editor</p>
                        <p className="text-xs text-white/55">
                          Submit with `Ctrl+Enter` or the submit button.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <TimerDisplay elapsedMs={elapsedMs} enabled={timerEnabled} onToggle={handleToggleTimer} />
                        <button
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            isBlindMode
                              ? "border-ember/60 bg-ember/15 text-white"
                              : "border-white/20 text-white/70 hover:border-white/50"
                          }`}
                          onClick={() => setIsBlindMode((prev) => !prev)}
                          type="button"
                          aria-pressed={isBlindMode}
                        >
                          Test mode {isBlindMode ? "on" : "off"}
                        </button>
                      </div>
                    </div>

                    {!isBlindMode ? (
                      <div className="mt-3 rounded-xl border border-white/10 bg-ink/80 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                            Gray reference (copy allowed)
                          </p>
                          <button
                            className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] text-white/65 transition hover:border-white/50"
                            onClick={handleCopyReference}
                            type="button"
                          >
                            {copyStatus ?? "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 max-h-32 max-w-full overflow-auto whitespace-pre rounded-lg bg-ink/75 p-3 font-mono text-[11px] leading-relaxed text-white/45">
                          {referenceSnippet}
                        </pre>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-ember/30 bg-ember/10 p-3 text-xs text-white/70">
                        Test mode enabled. Gray reference is hidden so you can try it blind.
                      </div>
                    )}

                    <textarea
                      className="mt-3 h-56 w-full rounded-xl border border-white/10 bg-ink/80 p-3 font-mono text-xs leading-relaxed text-white/90 outline-none transition focus:border-ember/50"
                      value={attemptCode}
                      onChange={(event) => handleAttemptChange(event.target.value)}
                      placeholder={`Implement ${focusedTopic.title} in ${activeLanguage?.name ?? "this language"}...`}
                      style={{ resize: "none" }}
                      onKeyDown={(event) => {
                        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                          event.preventDefault();
                          handleSubmitAttempt();
                          return;
                        }
                        if (event.key === "Tab") {
                          event.preventDefault();
                          const target = event.currentTarget;
                          const start = target.selectionStart ?? 0;
                          const end = target.selectionEnd ?? 0;
                          const updated = `${attemptCode.slice(0, start)}  ${attemptCode.slice(end)}`;
                          handleAttemptChange(updated);
                          window.requestAnimationFrame(() => {
                            target.selectionStart = target.selectionEnd = start + 2;
                          });
                        }
                      }}
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        className="group inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2 text-xs font-semibold text-ink shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleSubmitAttempt}
                        disabled={isSubmitting}
                        type="button"
                      >
                        <span className="h-2 w-2 rounded-full bg-ink/60 transition group-hover:scale-110" />
                        {isSubmitting ? "Submitting..." : "Submit Attempt"}
                      </button>
                      {practiceResult ? (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-xs ${practiceResult.isValid ? "text-moss" : "text-ember"}`}
                        >
                          {practiceResult.message}
                        </motion.span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-8 space-y-8">
          {learningGroups.map((group, groupIndex) => (
            <motion.section
              key={group.id}
              variants={sectionVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Track {groupIndex + 1}</p>
                  <h3 className="font-display text-2xl text-white">{group.title}</h3>
                </div>
                <p className="max-w-xl text-sm text-white/70">{group.description}</p>
              </div>

              <motion.div
                className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                variants={cardContainerVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {group.items.map((item) => {
                  const isFocused = focusedTopic?.id === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      variants={cardVariant}
                      whileHover={{ y: -2 }}
                      className={`algo-card rounded-2xl border p-4 text-left transition ${
                        isFocused
                          ? "border-ember/55 bg-ember/10 shadow-glow"
                          : "border-white/10 bg-white/[0.04] hover:border-white/25"
                      }`}
                      onClick={() => handleFocusTopic(item.id)}
                      type="button"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                        {isFocused ? "Now focused" : "Click to focus"}
                      </p>
                      <h4 className="mt-1 font-display text-lg text-white">{item.title}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-white/70">{item.explanation}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-white/65">
                        <span className="rounded-full border border-white/15 bg-ink/55 px-2 py-1">
                          Time: {item.complexity.time}
                        </span>
                        <span className="rounded-full border border-white/15 bg-ink/55 px-2 py-1">
                          Space: {item.complexity.space}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.section>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
