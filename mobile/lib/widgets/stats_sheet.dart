import 'package:flutter/material.dart';

import '../models/models.dart';
import '../models/stats.dart';
import '../theme/app_theme.dart';
import '../utils/time_utils.dart';

class StatsSheet extends StatelessWidget {
  const StatsSheet({
    super.key,
    required this.statsFuture,
  });

  final Future<StatsData> statsFuture;

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.85,
      minChildSize: 0.6,
      maxChildSize: 0.95,
      builder: (context, controller) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border.all(color: Colors.white.withOpacity(0.08)),
          ),
          child: FutureBuilder<StatsData>(
            future: statsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return Center(
                  child: Text(
                    'Could not load stats.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                  ),
                );
              }
              final data = snapshot.data!;
              return DefaultTabController(
                length: 2,
                child: Column(
                  children: [
                    const SizedBox(height: 12),
                    Container(
                      width: 38,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text('Stats', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 12),
                    TabBar(
                      tabs: const [
                        Tab(text: 'History'),
                        Tab(text: 'Best'),
                      ],
                      labelColor: Colors.white,
                      indicatorColor: AppColors.ember,
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: TabBarView(
                        children: [
                          _AttemptsList(attempts: data.attempts, controller: controller),
                          _BestList(bestScores: data.bestScores, controller: controller),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}

class _AttemptsList extends StatelessWidget {
  const _AttemptsList({required this.attempts, required this.controller});

  final List<AttemptRead> attempts;
  final ScrollController controller;

  @override
  Widget build(BuildContext context) {
    if (attempts.isEmpty) {
      return Center(
        child: Text(
          'No attempts yet.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white60),
        ),
      );
    }
    return ListView.separated(
      controller: controller,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      itemCount: attempts.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final item = attempts[index];
        return _StatTile(
          title: item.lessonTitle,
          subtitle: item.languageName,
          trailing: formatDurationMs(item.durationMs),
          footnote: formatTimestamp(item.createdAt),
          status: item.isCorrect ? 'Correct' : 'Incorrect',
          statusColor: item.isCorrect ? AppColors.moss : Colors.redAccent,
        );
      },
    );
  }
}

class _BestList extends StatelessWidget {
  const _BestList({required this.bestScores, required this.controller});

  final List<BestScoreRead> bestScores;
  final ScrollController controller;

  @override
  Widget build(BuildContext context) {
    if (bestScores.isEmpty) {
      return Center(
        child: Text(
          'No best times recorded yet.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white60),
        ),
      );
    }
    return ListView.separated(
      controller: controller,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      itemCount: bestScores.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final item = bestScores[index];
        return _StatTile(
          title: item.lessonTitle,
          subtitle: item.languageName,
          trailing: formatDurationMs(item.bestDurationMs),
          footnote: formatTimestamp(item.achievedAt),
          status: 'Best',
          statusColor: AppColors.ember,
        );
      },
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({
    required this.title,
    required this.subtitle,
    required this.trailing,
    required this.footnote,
    required this.status,
    required this.statusColor,
  });

  final String title;
  final String subtitle;
  final String trailing;
  final String footnote;
  final String status;
  final Color statusColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.04),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 4),
                    Text(subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white60)),
                  ],
                ),
              ),
              Text(trailing, style: Theme.of(context).textTheme.titleSmall),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(color: statusColor.withOpacity(0.5)),
                ),
                child: Text(
                  status,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.white70),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                footnote,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.white54),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
