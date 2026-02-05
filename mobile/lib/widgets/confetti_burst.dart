import 'dart:math';

import 'package:flutter/material.dart';

class ConfettiBurst extends StatefulWidget {
  const ConfettiBurst({super.key});

  @override
  State<ConfettiBurst> createState() => _ConfettiBurstState();
}

class _ConfettiBurstState extends State<ConfettiBurst> with SingleTickerProviderStateMixin {
  static const _colors = [
    Color(0xFFFF6B35),
    Color(0xFFF4D35E),
    Color(0xFF2A9D8F),
    Color(0xFF2E86AB),
    Color(0xFFF7F9FC),
  ];

  late final AnimationController _controller;
  late final List<_Piece> _pieces;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..forward();

    _pieces = List.generate(40, (index) {
      return _Piece(
        id: index,
        left: _random.nextDouble(),
        delay: _random.nextDouble() * 0.25,
        rotate: _random.nextDouble() * 360,
        drift: (_random.nextDouble() - 0.5) * 240,
        size: 6 + _random.nextDouble() * 8,
        color: _colors[index % _colors.length],
      );
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return Stack(
              children: _pieces.map((piece) {
                final t = ((_controller.value - piece.delay) / (1 - piece.delay)).clamp(0.0, 1.0);
                final eased = Curves.easeOut.transform(t);
                final y = -40 + 520 * eased;
                final x = piece.drift * eased;
                return Positioned(
                  top: 24 + y,
                  left: (piece.left * MediaQuery.of(context).size.width) + x,
                  child: Transform.rotate(
                    angle: (piece.rotate + 180 * eased) * (pi / 180),
                    child: Container(
                      width: piece.size,
                      height: piece.size * 0.5,
                      decoration: BoxDecoration(
                        color: piece.color,
                        borderRadius: BorderRadius.circular(2),
                        boxShadow: [
                          BoxShadow(
                            color: piece.color.withOpacity(0.4),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ),
    );
  }
}

class _Piece {
  const _Piece({
    required this.id,
    required this.left,
    required this.delay,
    required this.rotate,
    required this.drift,
    required this.size,
    required this.color,
  });

  final int id;
  final double left;
  final double delay;
  final double rotate;
  final double drift;
  final double size;
  final Color color;
}
