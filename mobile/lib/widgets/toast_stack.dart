import 'package:flutter/material.dart';

import '../state/toast_message.dart';
import 'achievement_toast.dart';

class ToastStack extends StatelessWidget {
  const ToastStack({
    super.key,
    required this.toasts,
    required this.isWide,
  });

  final List<ToastMessage> toasts;
  final bool isWide;

  @override
  Widget build(BuildContext context) {
    if (toasts.isEmpty) return const SizedBox.shrink();
    return Positioned(
      top: 24,
      right: isWide ? 24 : null,
      left: isWide ? null : 24,
      child: IgnorePointer(
        child: SizedBox(
          width: isWide ? 320 : MediaQuery.of(context).size.width - 48,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: toasts.map((toast) {
              return AnimatedSlide(
                duration: const Duration(milliseconds: 250),
                offset: toast.isVisible ? Offset.zero : const Offset(0.2, 0),
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 250),
                  opacity: toast.isVisible ? 1 : 0,
                  child: Padding(
                    key: ValueKey(toast.id),
                    padding: const EdgeInsets.only(bottom: 12),
                    child: ToastCard(toast: toast),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}
