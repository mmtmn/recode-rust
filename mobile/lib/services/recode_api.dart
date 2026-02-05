import '../models/models.dart';

abstract class RecodeApi {
  Future<List<Language>> listLanguages();
  Future<LanguageDetail> getLanguage(String slug);
  Future<LessonDetail> getLesson(int lessonId);
  Future<List<Achievement>> listAchievements();
  Future<Progress> getProgress();
  Future<LanguagePreferences> getLanguagePreferences();
  Future<LanguagePreferences> setLanguagePreferences(LanguagePreferences prefs);
  Future<CompletionResponse> completeLesson(int lessonId);
  Future<ValidationResult> submitChallenge(int challengeId, String code, int durationMs);
  Future<List<AttemptRead>> listAttempts(List<String> slugs);
  Future<List<BestScoreRead>> listBestScores(List<String> slugs);
}
