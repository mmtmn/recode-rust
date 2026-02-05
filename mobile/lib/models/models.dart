class Language {
  final int id;
  final String name;
  final String slug;
  final String description;
  final String color;
  final String icon;

  Language({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.color,
    required this.icon,
  });

  factory Language.fromJson(Map<String, dynamic> json) {
    return Language(
      id: json['id'] as int,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      color: json['color'] as String,
      icon: json['icon'] as String,
    );
  }
}

class Lesson {
  final int id;
  final String title;
  final String summary;
  final String difficulty;
  final int orderIndex;
  final int xp;

  Lesson({
    required this.id,
    required this.title,
    required this.summary,
    required this.difficulty,
    required this.orderIndex,
    required this.xp,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'] as int,
      title: json['title'] as String,
      summary: json['summary'] as String,
      difficulty: json['difficulty'] as String,
      orderIndex: json['order_index'] as int,
      xp: json['xp'] as int,
    );
  }
}

class Challenge {
  final int id;
  final String title;
  final String prompt;
  final String starterCode;
  final String solutionCode;
  final String tests;
  final int xp;

  Challenge({
    required this.id,
    required this.title,
    required this.prompt,
    required this.starterCode,
    required this.solutionCode,
    required this.tests,
    required this.xp,
  });

  factory Challenge.fromJson(Map<String, dynamic> json) {
    return Challenge(
      id: json['id'] as int,
      title: json['title'] as String,
      prompt: json['prompt'] as String,
      starterCode: json['starter_code'] as String,
      solutionCode: json['solution_code'] as String,
      tests: json['tests'] as String,
      xp: json['xp'] as int,
    );
  }
}

class LanguageDetail extends Language {
  final List<Lesson> lessons;

  LanguageDetail({
    required super.id,
    required super.name,
    required super.slug,
    required super.description,
    required super.color,
    required super.icon,
    required this.lessons,
  });

  factory LanguageDetail.fromJson(Map<String, dynamic> json) {
    return LanguageDetail(
      id: json['id'] as int,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      color: json['color'] as String,
      icon: json['icon'] as String,
      lessons: (json['lessons'] as List<dynamic>)
          .map((lesson) => Lesson.fromJson(lesson as Map<String, dynamic>))
          .toList(),
    );
  }
}

class LessonDetail extends Lesson {
  final List<Challenge> challenges;

  LessonDetail({
    required super.id,
    required super.title,
    required super.summary,
    required super.difficulty,
    required super.orderIndex,
    required super.xp,
    required this.challenges,
  });

  factory LessonDetail.fromJson(Map<String, dynamic> json) {
    return LessonDetail(
      id: json['id'] as int,
      title: json['title'] as String,
      summary: json['summary'] as String,
      difficulty: json['difficulty'] as String,
      orderIndex: json['order_index'] as int,
      xp: json['xp'] as int,
      challenges: (json['challenges'] as List<dynamic>)
          .map((challenge) => Challenge.fromJson(challenge as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Achievement {
  final int id;
  final String key;
  final String title;
  final String description;
  final String icon;
  final int points;

  Achievement({
    required this.id,
    required this.key,
    required this.title,
    required this.description,
    required this.icon,
    required this.points,
  });

  factory Achievement.fromJson(Map<String, dynamic> json) {
    return Achievement(
      id: json['id'] as int,
      key: json['key'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      points: json['points'] as int,
    );
  }
}

class Progress {
  final int xp;
  final int streak;
  final DateTime? lastCompletedAt;
  final int completedLessons;

  Progress({
    required this.xp,
    required this.streak,
    required this.lastCompletedAt,
    required this.completedLessons,
  });

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      xp: json['xp'] as int,
      streak: json['streak'] as int,
      lastCompletedAt: json['last_completed_at'] == null
          ? null
          : DateTime.parse(json['last_completed_at'] as String),
      completedLessons: json['completed_lessons'] as int,
    );
  }
}

class LanguagePreferences {
  final String playlistMode;
  final List<String> selectedSlugs;
  final String? selectedSlug;

  LanguagePreferences({
    required this.playlistMode,
    required this.selectedSlugs,
    required this.selectedSlug,
  });

  factory LanguagePreferences.fromJson(Map<String, dynamic> json) {
    return LanguagePreferences(
      playlistMode: json['playlist_mode'] as String,
      selectedSlugs: (json['selected_slugs'] as List<dynamic>).cast<String>(),
      selectedSlug: json['selected_slug'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'playlist_mode': playlistMode,
      'selected_slugs': selectedSlugs,
      'selected_slug': selectedSlug,
    };
  }
}

class CompletionResponse {
  final Progress progress;
  final List<Achievement> newAchievements;

  CompletionResponse({
    required this.progress,
    required this.newAchievements,
  });

  factory CompletionResponse.fromJson(Map<String, dynamic> json) {
    return CompletionResponse(
      progress: Progress.fromJson(json['progress'] as Map<String, dynamic>),
      newAchievements: (json['new_achievements'] as List<dynamic>)
          .map((item) => Achievement.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

class ValidationResult {
  final bool isValid;
  final List<String> errors;
  final bool newBest;
  final int? bestDurationMs;

  ValidationResult({
    required this.isValid,
    required this.errors,
    required this.newBest,
    required this.bestDurationMs,
  });

  factory ValidationResult.fromJson(Map<String, dynamic> json) {
    return ValidationResult(
      isValid: json['is_valid'] as bool,
      errors: (json['errors'] as List<dynamic>).cast<String>(),
      newBest: json['new_best'] == null ? false : json['new_best'] as bool,
      bestDurationMs: json['best_duration_ms'] as int?,
    );
  }
}

class AttemptRead {
  final int lessonId;
  final String lessonTitle;
  final String languageSlug;
  final String languageName;
  final int durationMs;
  final bool isCorrect;
  final String createdAt;

  AttemptRead({
    required this.lessonId,
    required this.lessonTitle,
    required this.languageSlug,
    required this.languageName,
    required this.durationMs,
    required this.isCorrect,
    required this.createdAt,
  });

  factory AttemptRead.fromJson(Map<String, dynamic> json) {
    return AttemptRead(
      lessonId: json['lesson_id'] as int,
      lessonTitle: json['lesson_title'] as String,
      languageSlug: json['language_slug'] as String,
      languageName: json['language_name'] as String,
      durationMs: json['duration_ms'] as int,
      isCorrect: json['is_correct'] as bool,
      createdAt: json['created_at'] as String,
    );
  }
}

class BestScoreRead {
  final int lessonId;
  final String lessonTitle;
  final String languageSlug;
  final String languageName;
  final int bestDurationMs;
  final String achievedAt;

  BestScoreRead({
    required this.lessonId,
    required this.lessonTitle,
    required this.languageSlug,
    required this.languageName,
    required this.bestDurationMs,
    required this.achievedAt,
  });

  factory BestScoreRead.fromJson(Map<String, dynamic> json) {
    return BestScoreRead(
      lessonId: json['lesson_id'] as int,
      lessonTitle: json['lesson_title'] as String,
      languageSlug: json['language_slug'] as String,
      languageName: json['language_name'] as String,
      bestDurationMs: json['best_duration_ms'] as int,
      achievedAt: json['achieved_at'] as String,
    );
  }
}
