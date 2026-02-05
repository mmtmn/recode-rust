import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/models.dart';
import '../theme/app_theme.dart';

class StatusBar extends StatelessWidget {
  const StatusBar({
    super.key,
    required this.progress,
    required this.onOpenStats,
    required this.onOpenAchievements,
    this.onOpenMenu,
  });

  final Progress? progress;
  final VoidCallback onOpenStats;
  final VoidCallback onOpenAchievements;
  final VoidCallback? onOpenMenu;

  @override
  Widget build(BuildContext context) {
    final xp = progress?.xp ?? 0;
    final streak = progress?.streak ?? 0;
    final completed = progress?.completedLessons ?? 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (onOpenMenu != null)
              IconButton(
                tooltip: 'Menu',
                onPressed: onOpenMenu,
                icon: const Icon(Icons.menu),
              ),
            Text(
              'Recode',
              style: GoogleFonts.spaceGrotesk(
                textStyle: Theme.of(context).textTheme.headlineMedium,
                fontWeight: FontWeight.w700,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: Colors.white.withOpacity(0.12)),
                color: Colors.white.withOpacity(0.05),
              ),
              child: Text(
                'Syntax drills, focused feedback',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Colors.white70,
                      letterSpacing: 1,
                    ),
              ),
            ),
            const Spacer(),
            IconButton(
              tooltip: 'Achievements',
              onPressed: onOpenAchievements,
              icon: const Icon(Icons.emoji_events_outlined),
            ),
            IconButton(
              tooltip: 'Stats',
              onPressed: onOpenStats,
              icon: const Icon(Icons.analytics_outlined),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _StatChip(label: 'XP', value: xp.toString()),
            _StatChip(label: 'Streak', value: streak.toString(), suffix: 'd'),
            _StatChip(label: 'Completed', value: completed.toString()),
          ],
        ),
      ],
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label, required this.value, this.suffix});

  final String label;
  final String value;
  final String? suffix;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
        color: AppColors.card.withOpacity(0.75),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label.toUpperCase(),
            style: Theme.of(context)
                .textTheme
                .labelSmall
                ?.copyWith(color: Colors.white54, letterSpacing: 1.2),
          ),
          const SizedBox(height: 4),
          _AnimatedValue(value: value, suffix: suffix),
        ],
      ),
    );
  }
}

class _AnimatedValue extends StatefulWidget {
  const _AnimatedValue({required this.value, this.suffix});

  final String value;
  final String? suffix;

  @override
  State<_AnimatedValue> createState() => _AnimatedValueState();
}

class _AnimatedValueState extends State<_AnimatedValue> {
  late int _previous;
  late int _current;

  @override
  void initState() {
    super.initState();
    _previous = int.tryParse(widget.value) ?? 0;
    _current = _previous;
  }

  @override
  void didUpdateWidget(covariant _AnimatedValue oldWidget) {
    super.didUpdateWidget(oldWidget);
    final next = int.tryParse(widget.value) ?? 0;
    if (next != _current) {
      _previous = _current;
      _current = next;
    }
  }

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: _previous.toDouble(), end: _current.toDouble()),
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeOut,
      builder: (context, number, child) {
        final display = number.round().toString();
        return Text(
          widget.suffix == null ? display : '$display${widget.suffix}',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
        );
      },
    );
  }
}
