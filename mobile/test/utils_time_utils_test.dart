import 'package:flutter_test/flutter_test.dart';

import 'package:recode_mobile/utils/time_utils.dart';

void main() {
  test('formatDurationMs formats mm:ss.xx', () {
    expect(formatDurationMs(0), '00:00.00');
    expect(formatDurationMs(1234), '00:01.23');
    expect(formatDurationMs(65000), '01:05.00');
  });

  test('formatTimestamp formats ISO strings', () {
    final date = DateTime.utc(2025, 1, 2, 3, 4).toIso8601String();
    final formatted = formatTimestamp(date);
    expect(formatted.contains('2025-01-02'), true);
  });
}
