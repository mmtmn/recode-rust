String formatDurationMs(int ms) {
  final totalSeconds = (ms / 1000).floor();
  final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
  final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
  final centiseconds = ((ms % 1000) / 10).floor().toString().padLeft(2, '0');
  return '$minutes:$seconds.$centiseconds';
}

String formatTimestamp(String? isoString) {
  if (isoString == null) return '—';
  try {
    final parsed = DateTime.parse(isoString).toLocal();
    final date = '${parsed.year}-${parsed.month.toString().padLeft(2, '0')}-${parsed.day.toString().padLeft(2, '0')}';
    final time = '${parsed.hour.toString().padLeft(2, '0')}:${parsed.minute.toString().padLeft(2, '0')}';
    return '$date $time';
  } catch (_) {
    return isoString;
  }
}
