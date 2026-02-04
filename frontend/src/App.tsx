import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import AchievementBadge from "./components/AchievementBadge";
import AchievementToast from "./components/AchievementToast";
import EditorPanel from "./components/EditorPanel";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { api, Achievement, Language, LanguageDetail, LessonDetail, Progress, ValidationResult } from "./lib/api";

type PlaylistItem = {
  id: string;
  lessonId: number;
  languageSlug: string;
  languageName: string;
  title: string;
  summary: string;
  orderIndex: number;
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageMap, setLanguageMap] = useState<Record<string, LanguageDetail>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [code, setCode] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [playlistMode, setPlaylistMode] = useState<"all" | "multi">("multi");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

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
        const firstSlug = languageData[0]?.slug ?? "";
        setSelectedSlug(firstSlug);
        setSelectedSlugs(firstSlug ? [firstSlug] : []);
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
    if (languages.length === 0) return;
    let isActive = true;
    async function loadDetails() {
      const entries = await Promise.all(
        languages.map(async (lang) => {
          const detail = await api.getLanguage(lang.slug);
          return [lang.slug, detail] as const;
        })
      );
      if (!isActive) return;
      setLanguageMap(Object.fromEntries(entries));
    }
    loadDetails();
    return () => {
      isActive = false;
    };
  }, [languages]);

  const playlist = useMemo<PlaylistItem[]>(() => {
    const slugs = playlistMode === "all" ? languages.map((lang) => lang.slug) : selectedSlugs;
    const details = slugs
      .map((slug) => languageMap[slug])
      .filter((detail): detail is LanguageDetail => Boolean(detail));
    if (details.length === 0) return [];

    const maxOrder = Math.max(...details.flatMap((detail) => detail.lessons.map((lesson) => lesson.order_index)));
    const items: PlaylistItem[] = [];
    for (let order = 1; order <= maxOrder; order += 1) {
      details
        .filter((detail) => detail.lessons.some((lesson) => lesson.order_index === order))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((detail) => {
          const lesson = detail.lessons.find((lesson) => lesson.order_index === order);
          if (!lesson) return;
          items.push({
            id: `${detail.slug}-${lesson.id}`,
            lessonId: lesson.id,
            languageSlug: detail.slug,
            languageName: detail.name,
            title: lesson.title,
            summary: lesson.summary,
            orderIndex: lesson.order_index
          });
        });
    }
    return items;
  }, [languages, languageMap, playlistMode, selectedSlugs]);

  const selectedItem = useMemo(
    () => playlist.find((item) => item.lessonId === selectedLessonId) ?? null,
    [playlist, selectedLessonId]
  );

  useEffect(() => {
    if (!selectedItem && playlist.length > 0) {
      setSelectedLessonId(playlist[0].lessonId);
      setSelectedSlug(playlist[0].languageSlug);
    }
  }, [playlist, selectedItem]);

  useEffect(() => {
    if (!selectedLessonId) {
      setLessonDetail(null);
      return;
    }
    let isActive = true;
    api.getLesson(selectedLessonId).then((detail) => {
      if (isActive) {
        setLessonDetail(detail);
        const challenge = detail.challenges[0];
        const prompt = challenge?.prompt ?? "";
        const commentPrefix = (() => {
          if (selectedSlug === "python") return "# ";
          if (selectedSlug === "sql") return "-- ";
          return "// ";
        })();
        const instruction = prompt ? `${commentPrefix}${prompt}` : "";
        const starter = challenge?.starter_code ?? "";
        const combined = [instruction, starter].filter(Boolean).join("\n");
        setCode(combined);
        setValidation(null);
        setSuccessMessage(null);
      }
    });
    return () => {
      isActive = false;
    };
  }, [selectedLessonId]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedSlug(selectedItem.languageSlug);
    }
  }, [selectedItem]);

  const topAchievements = useMemo(() => achievements.slice(0, 4), [achievements]);
  const activeChallenge = lessonDetail?.challenges[0] ?? null;

  const findNextPlaylistItem = () => {
    if (!selectedItem) return null;
    const index = playlist.findIndex((item) => item.id === selectedItem.id);
    if (index < 0) return null;
    return playlist[index + 1] ?? null;
  };

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
        const nextItem = findNextPlaylistItem();
        if (nextItem) {
          setSuccessMessage("Looks good. Moving to the next activity.");
          window.setTimeout(() => {
            setSelectedLessonId(nextItem.lessonId);
            setSelectedSlug(nextItem.languageSlug);
          }, 1200);
        } else {
          setSuccessMessage("Great work. You finished this playlist.");
        }
      } else {
        setSuccessMessage(null);
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

  const handleToggleLanguage = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        const next = prev.filter((item) => item !== slug);
        return next.length > 0 ? next : prev;
      }
      return [...prev, slug];
    });
  };

  const handleChangeMode = (mode: "all" | "multi") => {
    setPlaylistMode(mode);
    if (mode === "multi") {
      setSelectedSlugs(selectedSlug ? [selectedSlug] : []);
    }
    if (mode === "all") {
      setSelectedSlugs(languages.map((lang) => lang.slug));
    }
  };

  const handleSelectItem = (itemId: string) => {
    const item = playlist.find((entry) => entry.id === itemId);
    if (!item) return;
    setSelectedLessonId(item.lessonId);
    setSelectedSlug(item.languageSlug);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-ember/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-moss/20 blur-[110px]" />

      <header className="mx-auto max-w-6xl px-6 pt-12">
        <StatusBar progress={progress} onOpenAchievements={() => setShowAchievements(true)} />
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 pt-10 lg:grid-cols-[320px_1fr]">
        <Sidebar
          languages={languages}
          playlist={playlist}
          selectedItemId={selectedItem?.id ?? null}
          onSelectItem={handleSelectItem}
          isLoading={isLoading}
          playlistMode={playlistMode}
          onChangeMode={handleChangeMode}
          selectedSlugs={selectedSlugs}
          onToggleLanguage={handleToggleLanguage}
        />

        <div className="space-y-6">
          <motion.div variants={fadeIn} initial="hidden" animate="show">
            <EditorPanel
              challenge={activeChallenge}
              lessonTitle={lessonDetail?.title}
              lessonSummary={lessonDetail?.summary}
              languageName={selectedItem?.languageName ?? null}
              code={code}
              onCodeChange={setCode}
              onValidate={handleValidate}
              validation={validation}
              isValidating={isValidating || isCompleting}
              successMessage={successMessage}
            />
          </motion.div>

          {showAchievements ? (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/80 px-6">
              <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-ink/95 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Achievements</p>
                    <h3 className="font-display text-2xl text-white">Recent milestones</h3>
                  </div>
                  <button
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/50"
                    onClick={() => setShowAchievements(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {topAchievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
                <p className="mt-4 text-xs text-white/50">{achievements.length} total</p>
              </div>
            </div>
          ) : null}
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
