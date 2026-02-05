import 'models.dart';

class StatsData {
  const StatsData({required this.attempts, required this.bestScores});

  final List<AttemptRead> attempts;
  final List<BestScoreRead> bestScores;
}
