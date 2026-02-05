import 'package:flutter/foundation.dart';

enum ToastKind { achievement, best }

@immutable
class ToastMessage {
  const ToastMessage({
    required this.id,
    required this.kind,
    required this.title,
    required this.description,
    this.iconKey,
    this.points,
    this.isVisible = true,
  });

  final String id;
  final ToastKind kind;
  final String title;
  final String description;
  final String? iconKey;
  final int? points;
  final bool isVisible;

  ToastMessage copyWith({
    bool? isVisible,
  }) {
    return ToastMessage(
      id: id,
      kind: kind,
      title: title,
      description: description,
      iconKey: iconKey,
      points: points,
      isVisible: isVisible ?? this.isVisible,
    );
  }
}
