import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import AchievementBadge from "./components/AchievementBadge";
import AchievementToast from "./components/AchievementToast";
import EditorPanel from "./components/EditorPanel";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
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

  const topAchievements = useMemo(() => achievements.slice(0, 4), [achievements]);
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
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-ember/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-moss/20 blur-[110px]" />

      <header className="mx-auto max-w-6xl px-6 pt-12">
        <StatusBar progress={progress} activeLanguage={languageDetail?.name ?? null} />
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 pt-10 lg:grid-cols-[320px_1fr]">
        <Sidebar
          languages={languages}
          selectedSlug={selectedSlug}
          onSelectSlug={setSelectedSlug}
          lessons={languageDetail?.lessons ?? []}
          selectedLessonId={selectedLessonId}
          onSelectLesson={setSelectedLessonId}
          isLoading={isLoading}
        />

        <div className="space-y-6">
          <motion.div variants={fadeIn} initial="hidden" animate="show">
            <EditorPanel
              challenge={activeChallenge}
              code={code}
              onCodeChange={setCode}
              onValidate={handleValidate}
              validation={validation}
              isValidating={isValidating || isCompleting}
            />
          </motion.div>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Achievements</p>
                <h3 className="font-display text-2xl text-white">Recent milestones</h3>
              </div>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                {achievements.length} total
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {topAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>
        </div>
      </main>

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
