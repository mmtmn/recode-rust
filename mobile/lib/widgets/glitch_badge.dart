import 'package:flutter/material.dart';

class GlitchBadge extends StatefulWidget {
  const GlitchBadge({
    super.key,
    required this.label,
    required this.glitchKey,
    this.textStyle,
  });

  final String label;
  final int glitchKey;
  final TextStyle? textStyle;

  @override
  State<GlitchBadge> createState() => _GlitchBadgeState();
}

class _GlitchBadgeState extends State<GlitchBadge> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
  }

  @override
  void didUpdateWidget(covariant GlitchBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.glitchKey != widget.glitchKey) {
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final baseStyle = widget.textStyle ?? Theme.of(context).textTheme.labelSmall;
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _controller.value;
        final offset = (t * 2 - 1) * 2;
        final opacity = (1 - (t - 0.5).abs() * 2).clamp(0.0, 1.0) * 0.6;
        return Stack(
          alignment: Alignment.centerLeft,
          children: [
            child!,
            if (t > 0)
              Opacity(
                opacity: opacity,
                child: Transform.translate(
                  offset: Offset(offset, -1),
                  child: Text(
                    widget.label,
                    style: baseStyle?.copyWith(color: const Color(0xFF22D3EE)),
                  ),
                ),
              ),
            if (t > 0)
              Opacity(
                opacity: opacity,
                child: Transform.translate(
                  offset: Offset(-offset, 1),
                  child: Text(
                    widget.label,
                    style: baseStyle?.copyWith(color: const Color(0xFFF43F5E)),
                  ),
                ),
              ),
          ],
        );
      },
      child: Text(widget.label, style: baseStyle),
    );
  }
}
