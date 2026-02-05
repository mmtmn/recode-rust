import 'models.dart';

enum PlaylistMode { all, multi }

class PlaylistItem {
  const PlaylistItem({
    required this.id,
    required this.lessonId,
    required this.languageSlug,
    required this.languageName,
    required this.title,
    required this.summary,
    required this.orderIndex,
  });

  final String id;
  final int lessonId;
  final String languageSlug;
  final String languageName;
  final String title;
  final String summary;
  final int orderIndex;
}

List<PlaylistItem> buildPlaylist(
  Map<String, LanguageDetail> languageMap,
  List<String> selectedSlugs,
) {
  final details = selectedSlugs
      .map((slug) => languageMap[slug])
      .whereType<LanguageDetail>()
      .toList();
  if (details.isEmpty) return [];

  var maxOrder = 0;
  for (final detail in details) {
    for (final lesson in detail.lessons) {
      if (lesson.orderIndex > maxOrder) {
        maxOrder = lesson.orderIndex;
      }
    }
  }

  final items = <PlaylistItem>[];
  for (var order = 1; order <= maxOrder; order += 1) {
    for (final detail in details) {
      Lesson? lesson;
      for (final entry in detail.lessons) {
        if (entry.orderIndex == order) {
          lesson = entry;
          break;
        }
      }
      if (lesson == null) continue;
      items.add(
        PlaylistItem(
          id: '${detail.slug}-${lesson.id}',
          lessonId: lesson.id,
          languageSlug: detail.slug,
          languageName: detail.name,
          title: lesson.title,
          summary: lesson.summary,
          orderIndex: lesson.orderIndex,
        ),
      );
    }
  }
  return items;
}
