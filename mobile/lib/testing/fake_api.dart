import '../models/models.dart';
import '../services/recode_api.dart';

class FakeRecodeApi implements RecodeApi {
  FakeRecodeApi({
    List<Language>? languages,
    Map<String, LanguageDetail>? languageDetails,
    Map<int, LessonDetail>? lessonDetails,
    List<Achievement>? achievements,
    Progress? progress,
    LanguagePreferences? preferences,
  })  : _languages = languages ?? _sampleLanguages,
        _languageDetails = languageDetails ?? _sampleLanguageDetails,
        _lessonDetails = lessonDetails ?? _sampleLessonDetails,
        _achievements = achievements ?? _sampleAchievements,
        _progress = progress ?? Progress(xp: 120, streak: 2, lastCompletedAt: null, completedLessons: 3),
        _preferences = preferences ??
            LanguagePreferences(
              playlistMode: 'multi',
              selectedSlugs: ['python'],
              selectedSlug: 'python',
            );

  final List<Language> _languages;
  final Map<String, LanguageDetail> _languageDetails;
  final Map<int, LessonDetail> _lessonDetails;
  final List<Achievement> _achievements;
  Progress _progress;
  LanguagePreferences _preferences;

  @override
  Future<List<Language>> listLanguages() async => _languages;

  @override
  Future<LanguageDetail> getLanguage(String slug) async => _languageDetails[slug]!;

  @override
  Future<LessonDetail> getLesson(int lessonId) async => _lessonDetails[lessonId]!;

  @override
  Future<List<Achievement>> listAchievements() async => _achievements;

  @override
  Future<Progress> getProgress() async => _progress;

  @override
  Future<LanguagePreferences> getLanguagePreferences() async => _preferences;

  @override
  Future<LanguagePreferences> setLanguagePreferences(LanguagePreferences prefs) async {
    _preferences = prefs;
    return _preferences;
  }

  @override
  Future<CompletionResponse> completeLesson(int lessonId) async {
    _progress = Progress(
      xp: _progress.xp + 40,
      streak: _progress.streak,
      lastCompletedAt: DateTime.now(),
      completedLessons: _progress.completedLessons + 1,
    );

    return CompletionResponse(
      progress: _progress,
      newAchievements: [
        Achievement(
          id: 99,
          key: 'first_lesson',
          title: 'First Steps',
          description: 'Complete your first lesson.',
          icon: 'spark',
          points: 50,
        ),
      ],
    );
  }

  @override
  Future<ValidationResult> submitChallenge(int challengeId, String code, int durationMs) async {
    final lesson = _lessonDetails.values.firstWhere((detail) => detail.challenges.first.id == challengeId);
    final challenge = lesson.challenges.first;
    final isValid = code.trim() == challenge.solutionCode.trim();
    return ValidationResult(
      isValid: isValid,
      errors: isValid ? [] : ['Expected output did not match.'],
      newBest: isValid,
      bestDurationMs: isValid ? durationMs : null,
    );
  }

  @override
  Future<List<AttemptRead>> listAttempts(List<String> slugs) async {
    return [
      AttemptRead(
        lessonId: 1,
        lessonTitle: 'Phase 1: Absolute Basics A',
        languageSlug: 'python',
        languageName: 'Python',
        durationMs: 23000,
        isCorrect: true,
        createdAt: DateTime.now().toIso8601String(),
      ),
    ];
  }

  @override
  Future<List<BestScoreRead>> listBestScores(List<String> slugs) async {
    return [
      BestScoreRead(
        lessonId: 1,
        lessonTitle: 'Phase 1: Absolute Basics A',
        languageSlug: 'python',
        languageName: 'Python',
        bestDurationMs: 18000,
        achievedAt: DateTime.now().toIso8601String(),
      ),
    ];
  }
}

final _sampleLanguages = <Language>[
  Language(
    id: 1,
    name: 'Python',
    slug: 'python',
    description: 'Readable, batteries-included, and ideal for quick wins.',
    color: '#2B6CB0',
    icon: 'snake',
  ),
  Language(
    id: 2,
    name: 'JavaScript',
    slug: 'javascript',
    description: 'The language of the web and interactive frontends.',
    color: '#D69E2E',
    icon: 'bolt',
  ),
];

final _sampleLanguageDetails = <String, LanguageDetail>{
  'python': LanguageDetail(
    id: 1,
    name: 'Python',
    slug: 'python',
    description: 'Readable, batteries-included, and ideal for quick wins.',
    color: '#2B6CB0',
    icon: 'snake',
    lessons: [
      Lesson(
        id: 1,
        title: 'Phase 1: Absolute Basics A',
        summary: 'Print output and confirm the interpreter obeys you.',
        difficulty: 'Beginner',
        orderIndex: 1,
        xp: 40,
      ),
      Lesson(
        id: 2,
        title: 'Phase 1: Absolute Basics B',
        summary: 'Print values with more structure.',
        difficulty: 'Beginner',
        orderIndex: 2,
        xp: 40,
      ),
    ],
  ),
  'javascript': LanguageDetail(
    id: 2,
    name: 'JavaScript',
    slug: 'javascript',
    description: 'The language of the web and interactive frontends.',
    color: '#D69E2E',
    icon: 'bolt',
    lessons: [
      Lesson(
        id: 3,
        title: 'Phase 1: Absolute Basics A',
        summary: 'Print output and confirm the interpreter obeys you.',
        difficulty: 'Beginner',
        orderIndex: 1,
        xp: 40,
      ),
    ],
  ),
};

final _sampleLessonDetails = <int, LessonDetail>{
  1: LessonDetail(
    id: 1,
    title: 'Phase 1: Absolute Basics A',
    summary: 'Print output and confirm the interpreter obeys you.',
    difficulty: 'Beginner',
    orderIndex: 1,
    xp: 40,
    challenges: [
      Challenge(
        id: 101,
        title: 'Phase 1: Absolute Basics A Challenge',
        prompt: 'Print the word hello.',
        starterCode: 'print()\n',
        solutionCode: 'print("hello")\n',
        tests: 'assert output == "hello"',
        xp: 40,
      ),
    ],
  ),
  2: LessonDetail(
    id: 2,
    title: 'Phase 1: Absolute Basics B',
    summary: 'Print values with more structure.',
    difficulty: 'Beginner',
    orderIndex: 2,
    xp: 40,
    challenges: [
      Challenge(
        id: 102,
        title: 'Phase 1: Absolute Basics B Challenge',
        prompt: 'Print the word world.',
        starterCode: 'print()\n',
        solutionCode: 'print("world")\n',
        tests: 'assert output == "world"',
        xp: 40,
      ),
    ],
  ),
  3: LessonDetail(
    id: 3,
    title: 'Phase 1: Absolute Basics A',
    summary: 'Print output and confirm the interpreter obeys you.',
    difficulty: 'Beginner',
    orderIndex: 1,
    xp: 40,
    challenges: [
      Challenge(
        id: 103,
        title: 'Phase 1: Absolute Basics A Challenge',
        prompt: 'Log hello.',
        starterCode: 'console.log();\n',
        solutionCode: 'console.log("hello");\n',
        tests: 'assert output == "hello"',
        xp: 40,
      ),
    ],
  ),
};

final _sampleAchievements = <Achievement>[
  Achievement(
    id: 1,
    key: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson.',
    icon: 'spark',
    points: 50,
  ),
  Achievement(
    id: 2,
    key: 'five_lessons',
    title: 'Syntax Explorer',
    description: 'Complete five lessons.',
    icon: 'map',
    points: 150,
  ),
];
