import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import AchievementBadge from "./components/AchievementBadge";
import AchievementToast from "./components/AchievementToast";
import EditorPanel from "./components/EditorPanel";
import LanguageCard from "./components/LanguageCard";
import LessonRow from "./components/LessonRow";
import ProgressPanel from "./components/ProgressPanel";
import { api, Achievement, Language, LanguageDetail, LessonDetail, Progress, ValidationResult } from "./lib/api";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [languageDetail, setLanguageDetail] = useState<LanguageDetail | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [code, setCode] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    let isActive = true;
    async function loadData() {
      try {
        const [languageData, progressData, achievementData] = await Promise.all([
          api.listLanguages(),
          api.getProgress(),
          api.listAchievements()
        ]);
        if (!isActive) return;
        setLanguages(languageData);
        setProgress(progressData);
        setAchievements(achievementData);
        setSelectedSlug(languageData[0]?.slug ?? "");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    let isActive = true;
    api.getLanguage(selectedSlug).then((detail) => {
      if (isActive) {
        setLanguageDetail(detail);
        setSelectedLessonId(detail.lessons[0]?.id ?? null);
      }
    });
    return () => {
      isActive = false;
    };
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedLessonId) {
      setLessonDetail(null);
      return;
    }
    let isActive = true;
    api.getLesson(selectedLessonId).then((detail) => {
      if (isActive) {
        setLessonDetail(detail);
        setCode(detail.challenges[0]?.starter_code ?? "");
        setValidation(null);
      }
    });
    return () => {
      isActive = false;
    };
  }, [selectedLessonId]);

  const topAchievements = useMemo(() => achievements.slice(0, 3), [achievements]);
  const activeChallenge = lessonDetail?.challenges[0] ?? null;

  const handleCompleteLesson = async (lessonId: number) => {
    setIsCompleting(true);
    try {
      const response = await api.completeLesson(lessonId);
      setProgress(response.progress);
      if (response.new_achievements.length > 0) {
        setToasts((prev) => [...response.new_achievements, ...prev]);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleValidate = async () => {
    if (!activeChallenge || !lessonDetail) return;
    setIsValidating(true);
    try {
      const result = await api.validateChallenge(activeChallenge.id, code);
      setValidation(result);
      if (result.is_valid) {
        await handleCompleteLesson(lessonDetail.id);
      }
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const timeout = window.setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-ember/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-moss/20 blur-[110px]" />

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-14">
        <motion.section variants={fadeIn} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">SyntaxQuest Beta</p>
            <h1 className="font-display text-4xl leading-tight text-white md:text-5xl">
              LeetCode-style syntax drills for every core language.
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Master fundamentals with bite-sized quests, instant XP, and achievement streaks. Designed for
              learning the basics of the world's most important languages.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
                Start a Quest
              </button>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/50">
                Explore Roadmap
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/70 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-white/40">Languages</p>
                <p className="mt-2 text-xl text-white">{languages.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-white/40">Lessons</p>
                <p className="mt-2 text-xl text-white">{languages.length * 4}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-white/40">Achievements</p>
                <p className="mt-2 text-xl text-white">{achievements.length}</p>
              </div>
            </div>
          </div>
          <ProgressPanel progress={progress} />
        </motion.section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Language Paths</p>
              <h2 className="font-display text-3xl text-white">Pick your syntax adventure</h2>
            </div>
            <p className="text-sm text-white/60">Click a language to reveal its quest line.</p>
          </div>
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
              Loading languages...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {languages.map((language) => (
                <LanguageCard
                  key={language.id}
                  language={language}
                  isActive={language.slug === selectedSlug}
                  onSelect={setSelectedSlug}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quest Line</p>
                <h3 className="font-display text-2xl text-white">
                  {languageDetail ? languageDetail.name : "Choose a language"}
                </h3>
              </div>
              <div className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                {languageDetail?.lessons.length ?? 0} lessons
              </div>
            </div>
            <div className="space-y-3">
              {languageDetail?.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={setSelectedLessonId}
                  disabled={isCompleting || isValidating}
                  active={lesson.id === selectedLessonId}
                />
              ))}
            </div>
          </div>
          <EditorPanel
            challenge={activeChallenge}
            code={code}
            onCodeChange={setCode}
            onValidate={handleValidate}
            validation={validation}
            isValidating={isValidating}
          />
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Achievements</p>
            <h3 className="font-display text-2xl text-white">Collect rare milestones</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {topAchievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Validate syntax to claim XP, then keep your streak alive to unlock higher-tier achievements.
          </div>
        </section>

        <motion.section variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Instant feedback</p>
            <h4 className="mt-3 font-display text-xl text-white">Syntax-first challenges</h4>
            <p className="mt-3 text-sm text-white/70">
              Every lesson focuses on real syntax patterns so learners can build muscle memory quickly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Gamified core</p>
            <h4 className="mt-3 font-display text-xl text-white">XP, streaks, and quests</h4>
            <p className="mt-3 text-sm text-white/70">
              Earn XP for completing lessons, keep a streak, and unlock achievements that celebrate progress.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Beautiful by default</p>
            <h4 className="mt-3 font-display text-xl text-white">Cinematic learning flows</h4>
            <p className="mt-3 text-sm text-white/70">
              Bold visuals, subtle animation, and elegant layouts make every quest feel rewarding.
            </p>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        SyntaxQuest is a prototype learning experience built for core syntax mastery.
      </footer>

      <div className="fixed right-6 top-6 z-50 flex w-72 flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <AchievementToast key={`${toast.id}-${toast.key}`} achievement={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
