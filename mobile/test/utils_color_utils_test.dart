import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:recode_mobile/utils/color_utils.dart';

void main() {
  test('parseHexColor handles 6-char hex', () {
    expect(parseHexColor('#FF0000'), const Color(0xFFFF0000));
  });

  test('parseHexColor handles 8-char hex', () {
    expect(parseHexColor('80FFFFFF'), const Color(0x80FFFFFF));
  });

  test('parseHexColor falls back to white', () {
    expect(parseHexColor('bad'), Colors.white);
  });
}
