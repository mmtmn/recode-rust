import 'package:flutter/material.dart';

import '../models/models.dart';
import '../models/playlist.dart';
import '../theme/app_theme.dart';
import '../utils/color_utils.dart';
import '../utils/icon_utils.dart';

class PlaylistSidebar extends StatelessWidget {
  const PlaylistSidebar({
    super.key,
    required this.languages,
    required this.playlist,
    required this.selectedItemId,
    required this.isLoading,
    required this.playlistMode,
    required this.selectedSlugs,
    required this.onSelectItem,
    required this.onToggleLanguage,
    required this.onChangeMode,
  });

  final List<Language> languages;
  final List<PlaylistItem> playlist;
  final String? selectedItemId;
  final bool isLoading;
  final PlaylistMode playlistMode;
  final List<String> selectedSlugs;
  final ValueChanged<String> onSelectItem;
  final ValueChanged<String> onToggleLanguage;
  final ValueChanged<PlaylistMode> onChangeMode;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card.withOpacity(0.9),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Playlist',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600),
              ),
              const Spacer(),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: isLoading ? 1 : 0,
                child: const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _PlaylistModeToggle(mode: playlistMode, onChange: onChangeMode),
          const SizedBox(height: 16),
          Text(
            'Languages',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: languages.map((language) {
              final isSelected = selectedSlugs.contains(language.slug);
              return FilterChip(
                selected: isSelected,
                onSelected: (_) => onToggleLanguage(language.slug),
                label: Text(language.name),
                avatar: CircleAvatar(
                  backgroundColor: parseHexColor(language.color).withOpacity(0.25),
                  child: Icon(iconForKey(language.icon), size: 16, color: Colors.white70),
                ),
                selectedColor: AppColors.moss.withOpacity(0.35),
                checkmarkColor: Colors.white,
              );
            }).toList(),
          ),
          const SizedBox(height: 18),
          Text(
            'Sessions',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: playlist.isEmpty
                ? Center(
                    child: Text(
                      'Pick a language to start.',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white54),
                    ),
                  )
                : ListView.separated(
                    itemCount: playlist.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = playlist[index];
                      final isActive = item.id == selectedItemId;
                      return AnimatedScale(
                        duration: const Duration(milliseconds: 200),
                        scale: isActive ? 1.02 : 1.0,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(16),
                          onTap: () => onSelectItem(item.id),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              color: isActive ? Colors.white.withOpacity(0.08) : Colors.transparent,
                              border: Border.all(
                                color: isActive ? AppColors.sun.withOpacity(0.6) : Colors.white.withOpacity(0.05),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      item.languageName,
                                      style: Theme.of(context)
                                          .textTheme
                                          .labelSmall
                                          ?.copyWith(color: Colors.white54),
                                    ),
                                    const Spacer(),
                                    Text(
                                      'Phase ${item.orderIndex}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .labelSmall
                                          ?.copyWith(color: Colors.white38),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  item.title,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleSmall
                                      ?.copyWith(fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item.summary,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(color: Colors.white60),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _PlaylistModeToggle extends StatelessWidget {
  const _PlaylistModeToggle({required this.mode, required this.onChange});

  final PlaylistMode mode;
  final ValueChanged<PlaylistMode> onChange;

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<PlaylistMode>(
      segments: const [
        ButtonSegment(value: PlaylistMode.multi, label: Text('Selected')),
        ButtonSegment(value: PlaylistMode.all, label: Text('All')),
      ],
      selected: {mode},
      onSelectionChanged: (value) {
        if (value.isEmpty) return;
        onChange(value.first);
      },
      style: ButtonStyle(
        backgroundColor: MaterialStateProperty.resolveWith(
          (states) => states.contains(MaterialState.selected) ? AppColors.ember.withOpacity(0.3) : null,
        ),
        foregroundColor: MaterialStateProperty.resolveWith(
          (states) => states.contains(MaterialState.selected) ? Colors.white : Colors.white70,
        ),
      ),
    );
  }
}
