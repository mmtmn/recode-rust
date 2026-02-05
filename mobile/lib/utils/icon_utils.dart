import 'package:flutter/material.dart';

IconData iconForKey(String key) {
  switch (key) {
    case 'snake':
      return Icons.emoji_nature;
    case 'bolt':
      return Icons.bolt;
    case 'shield':
      return Icons.shield;
    case 'cup':
      return Icons.coffee;
    case 'gear':
      return Icons.settings;
    case 'spark':
      return Icons.auto_awesome;
    case 'wind':
      return Icons.air;
    case 'anchor':
      return Icons.anchor;
    case 'database':
      return Icons.storage;
    case 'map':
      return Icons.map;
    case 'flame':
      return Icons.local_fire_department;
    case 'star':
      return Icons.star;
    default:
      return Icons.bubble_chart;
  }
}
