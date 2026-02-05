import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/models.dart';
import '../theme/app_theme.dart';
import '../utils/time_utils.dart';
import 'glitch_badge.dart';

class EditorPanel extends StatefulWidget {
  const EditorPanel({
    super.key,
    required this.lessonDetail,
    required this.challenge,
    required this.languages,
    required this.selectedSlug,
    required this.languageGlitchKey,
    required this.onLanguageChange,
    required this.codeController,
    required this.onCodeChanged,
    required this.onValidate,
    required this.validation,
    required this.isValidating,
    required this.successMessage,
    required this.timerEnabled,
    required this.timerMs,
    required this.onToggleTimer,
    required this.isFullscreen,
    required this.onToggleFullscreen,
  });

  final LessonDetail? lessonDetail;
  final Challenge? challenge;
  final List<Language> languages;
  final String? selectedSlug;
  final int languageGlitchKey;
  final ValueChanged<String> onLanguageChange;
  final TextEditingController codeController;
  final ValueChanged<String> onCodeChanged;
  final VoidCallback onValidate;
  final ValidationResult? validation;
  final bool isValidating;
  final String? successMessage;
  final bool timerEnabled;
  final int timerMs;
  final VoidCallback onToggleTimer;
  final bool isFullscreen;
  final VoidCallback onToggleFullscreen;

  @override
  State<EditorPanel> createState() => _EditorPanelState();
}

class _EditorPanelState extends State<EditorPanel> {
  final FocusNode _editorFocus = FocusNode();

  @override
  void dispose() {
    _editorFocus.dispose();
    super.dispose();
  }

  void _insertTab() {
    final text = widget.codeController.text;
    final selection = widget.codeController.selection;
    final start = selection.start < 0 ? text.length : selection.start;
    final end = selection.end < 0 ? text.length : selection.end;
    final updated = text.replaceRange(start, end, '  ');
    widget.codeController.text = updated;
    widget.codeController.selection = TextSelection.collapsed(offset: start + 2);
    widget.onCodeChanged(updated);
  }

  @override
  Widget build(BuildContext context) {
    final showSuccess = widget.validation?.isValid == true;
    final showError = widget.validation != null && widget.validation?.isValid == false;
    final borderColor = showSuccess
        ? AppColors.moss.withOpacity(0.6)
        : showError
            ? Colors.redAccent.withOpacity(0.6)
            : Colors.white.withOpacity(0.1);

    final languageName = widget.languages
        .firstWhere(
          (lang) => lang.slug == widget.selectedSlug,
          orElse: () => Language(
            id: -1,
            name: 'Language',
            slug: '',
            description: '',
            color: '#ffffff',
            icon: 'spark',
          ),
        )
        .name;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
      padding: EdgeInsets.all(widget.isFullscreen ? 28 : 22),
      decoration: BoxDecoration(
        color: AppColors.card.withOpacity(widget.isFullscreen ? 0.96 : 0.85),
        borderRadius: BorderRadius.circular(widget.isFullscreen ? 0 : 24),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: borderColor.withOpacity(0.25),
            blurRadius: 20,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: widget.lessonDetail == null
          ? _EmptyState()
          : Stack(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Task'.toUpperCase(),
                                style: Theme.of(context)
                                    .textTheme
                                    .labelSmall
                                    ?.copyWith(color: Colors.white54, letterSpacing: 2),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                widget.lessonDetail!.title,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineSmall
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                widget.lessonDetail!.summary,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                              ),
                              const SizedBox(height: 14),
                              Wrap(
                                spacing: 12,
                                runSpacing: 12,
                                crossAxisAlignment: WrapCrossAlignment.center,
                                children: [
                                  _LanguagePicker(
                                    languages: widget.languages,
                                    selectedSlug: widget.selectedSlug,
                                    onChanged: widget.onLanguageChange,
                                    label: languageName,
                                    glitchKey: widget.languageGlitchKey,
                                  ),
                                  _TimerBadge(
                                    enabled: widget.timerEnabled,
                                    elapsedMs: widget.timerMs,
                                    onToggle: widget.onToggleTimer,
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.04),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.auto_graph, size: 16, color: Colors.white70),
                                        const SizedBox(width: 6),
                                        Text(
                                          '${widget.lessonDetail!.xp} XP',
                                          style: Theme.of(context).textTheme.labelMedium,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        TextButton(
                          onPressed: widget.onToggleFullscreen,
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white70,
                            side: BorderSide(color: Colors.white.withOpacity(0.2)),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                          ),
                          child: Text(widget.isFullscreen ? 'Exit full screen' : 'Full screen'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    if (widget.challenge != null)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.04),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Prompt'.toUpperCase(),
                              style: Theme.of(context)
                                  .textTheme
                                  .labelSmall
                                  ?.copyWith(color: Colors.white70, letterSpacing: 1.6),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              widget.challenge!.prompt,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
                            ),
                          ],
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.04),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: Text(
                          'Choose a lesson to open its syntax challenge.',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white60),
                        ),
                      ),
                    const SizedBox(height: 18),
                    Text(
                      'Editor'.toUpperCase(),
                      style: Theme.of(context)
                          .textTheme
                          .labelSmall
                          ?.copyWith(color: Colors.white70, letterSpacing: 1.6),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: Focus(
                        focusNode: _editorFocus,
                        onKey: (node, event) {
                          if (event is RawKeyDownEvent) {
                            final isCtrlEnter = (event.logicalKey == LogicalKeyboardKey.enter) &&
                                (event.isControlPressed || event.isMetaPressed);
                            if (isCtrlEnter) {
                              widget.onValidate();
                              return KeyEventResult.handled;
                            }
                            if (event.logicalKey == LogicalKeyboardKey.tab) {
                              _insertTab();
                              return KeyEventResult.handled;
                            }
                          }
                          return KeyEventResult.ignored;
                        },
                      child: TextField(
                        controller: widget.codeController,
                        focusNode: _editorFocus,
                          onChanged: widget.onCodeChanged,
                          maxLines: null,
                          expands: true,
                          keyboardType: TextInputType.multiline,
                          textInputAction: TextInputAction.newline,
                          style: GoogleFonts.jetBrainsMono(
                            fontSize: 14,
                            height: 1.5,
                            color: Colors.white,
                          ),
                          decoration: InputDecoration(
                            hintText: 'Start typing your solution here...',
                            hintStyle: GoogleFonts.jetBrainsMono(color: Colors.white38, fontSize: 13),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: widget.isValidating ? null : widget.onValidate,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              backgroundColor: AppColors.ember,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            icon: widget.isValidating
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : const Icon(Icons.play_arrow),
                            label: Text(widget.isValidating ? 'Validating...' : 'Validate Syntax'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tip: press Ctrl+Enter to run.',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white54),
                    ),
                    const SizedBox(height: 16),
                    _ValidationPanel(
                      validation: widget.validation,
                      successMessage: widget.successMessage,
                      solutionCode: widget.challenge?.solutionCode,
                    ),
                  ],
                ),
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 300),
                  opacity: showSuccess ? 1 : 0,
                  child: IgnorePointer(
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(widget.isFullscreen ? 0 : 24),
                        border: Border.all(color: AppColors.moss.withOpacity(0.4)),
                        color: AppColors.moss.withOpacity(0.12),
                      ),
                      child: Align(
                        alignment: Alignment.topRight,
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppColors.moss.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(color: AppColors.moss.withOpacity(0.5)),
                            ),
                            child: Text(
                              'Success'.toUpperCase(),
                              style: Theme.of(context)
                                  .textTheme
                                  .labelSmall
                                  ?.copyWith(color: AppColors.moss, letterSpacing: 2),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'Select a lesson to begin.',
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white60),
      ),
    );
  }
}

class _LanguagePicker extends StatelessWidget {
  const _LanguagePicker({
    required this.languages,
    required this.selectedSlug,
    required this.onChanged,
    required this.label,
    required this.glitchKey,
  });

  final List<Language> languages;
  final String? selectedSlug;
  final ValueChanged<String> onChanged;
  final String label;
  final int glitchKey;

  @override
  Widget build(BuildContext context) {
    final currentSlug = selectedSlug != null && languages.any((lang) => lang.slug == selectedSlug)
        ? selectedSlug
        : (languages.isNotEmpty ? languages.first.slug : null);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
        color: Colors.white.withOpacity(0.04),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          GlitchBadge(
            label: label,
            glitchKey: glitchKey,
            textStyle: Theme.of(context)
                .textTheme
                .labelSmall
                ?.copyWith(color: Colors.white70, letterSpacing: 1.2),
          ),
          const SizedBox(width: 8),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              dropdownColor: AppColors.card,
              value: currentSlug,
              items: languages
                  .map(
                    (lang) => DropdownMenuItem(
                      value: lang.slug,
                      child: Text(lang.name),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value != null) {
                  onChanged(value);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _TimerBadge extends StatelessWidget {
  const _TimerBadge({
    required this.enabled,
    required this.elapsedMs,
    required this.onToggle,
  });

  final bool enabled;
  final int elapsedMs;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
        color: Colors.white.withOpacity(0.04),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            formatDurationMs(elapsedMs),
            style: GoogleFonts.jetBrainsMono(
              fontSize: 14,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 10),
          Switch(
            value: enabled,
            onChanged: (_) => onToggle(),
            activeColor: AppColors.ember,
          ),
        ],
      ),
    );
  }
}

class _ValidationPanel extends StatelessWidget {
  const _ValidationPanel({
    required this.validation,
    required this.successMessage,
    required this.solutionCode,
  });

  final ValidationResult? validation;
  final String? successMessage;
  final String? solutionCode;

  @override
  Widget build(BuildContext context) {
    if (validation == null && successMessage == null) {
      return Text(
        'Run validation to check your solution and track time.',
        style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white54),
      );
    }

    if (validation != null && validation!.isValid) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.moss.withOpacity(0.2),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.moss.withOpacity(0.5)),
        ),
        child: Text(
          successMessage ?? 'Looks good. Great work!',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
        ),
      );
    }

    if (validation != null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.redAccent.withOpacity(0.15),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.redAccent.withOpacity(0.4)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Needs another pass',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
            ),
            const SizedBox(height: 8),
            ...validation!.errors.map(
              (error) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(
                  '• $error',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white70),
                ),
              ),
            ),
            if (solutionCode != null && solutionCode!.trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                'Correct syntax'.toUpperCase(),
                style: Theme.of(context)
                    .textTheme
                    .labelSmall
                    ?.copyWith(color: Colors.white60, letterSpacing: 1.4),
              ),
              const SizedBox(height: 6),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Text(
                  solutionCode!,
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 12,
                    height: 1.5,
                    color: Colors.white70,
                  ),
                ),
              ),
            ],
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
