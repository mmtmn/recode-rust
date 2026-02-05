import 'package:flutter/material.dart';

import '../state/toast_message.dart';
import '../theme/app_theme.dart';
import '../utils/icon_utils.dart';

class ToastCard extends StatelessWidget {
  const ToastCard({super.key, required this.toast});

  final ToastMessage toast;

  @override
  Widget build(BuildContext context) {
    final isBest = toast.kind == ToastKind.best;
    final background = isBest ? AppColors.moss : AppColors.ember;
    final icon = isBest ? Icons.timer : iconForKey(toast.iconKey ?? 'spark');
    final label = isBest ? 'Personal Best' : 'Achievement';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: background.withOpacity(0.12),
        border: Border.all(color: background.withOpacity(0.5)),
        boxShadow: [
          BoxShadow(
            color: background.withOpacity(0.2),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: background.withOpacity(0.2),
                ),
                child: Icon(icon, color: Colors.white),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label.toUpperCase(),
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: Colors.white70,
                            letterSpacing: 1.4,
                          ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      toast.title,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
              if (toast.points != null)
                Text(
                  '+${toast.points} XP',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.white70),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            toast.description,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
