import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:recode_mobile/utils/icon_utils.dart';

void main() {
  test('iconForKey returns defaults', () {
    expect(iconForKey('snake'), Icons.emoji_nature);
    expect(iconForKey('unknown'), Icons.bubble_chart);
  });
}
