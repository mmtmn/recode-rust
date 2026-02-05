import 'package:flutter/foundation.dart';

import '../models/models.dart';
import '../models/playlist.dart';
import 'toast_message.dart';

@immutable
class HomeState {
  const HomeState({
    required this.isLoading,
    required this.isValidating,
    required this.isCompleting,
    required this.languages,
    required this.languageMap,
    required this.selectedSlug,
    required this.selectedLessonId,
    required this.lessonDetail,
    required this.validation,
    required this.successMessage,
    required this.progress,
    required this.achievements,
    required this.playlistMode,
    required this.selectedSlugs,
    required this.hasRestoredPrefs,
    required this.timerEnabled,
    required this.elapsedMs,
    required this.code,
    required this.initialCode,
    required this.isFullscreen,
    required this.languageGlitchKey,
    required this.toasts,
    required this.showConfetti,
    required this.errorMessage,
  });

  final bool isLoading;
  final bool isValidating;
  final bool isCompleting;
  final List<Language> languages;
  final Map<String, LanguageDetail> languageMap;
  final String selectedSlug;
  final int? selectedLessonId;
  final LessonDetail? lessonDetail;
  final ValidationResult? validation;
  final String? successMessage;
  final Progress? progress;
  final List<Achievement> achievements;
  final PlaylistMode playlistMode;
  final List<String> selectedSlugs;
  final bool hasRestoredPrefs;
  final bool timerEnabled;
  final int elapsedMs;
  final String code;
  final String initialCode;
  final bool isFullscreen;
  final int languageGlitchKey;
  final List<ToastMessage> toasts;
  final bool showConfetti;
  final String? errorMessage;

  static const _sentinel = Object();

  factory HomeState.initial() {
    return const HomeState(
      isLoading: true,
      isValidating: false,
      isCompleting: false,
      languages: [],
      languageMap: {},
      selectedSlug: '',
      selectedLessonId: null,
      lessonDetail: null,
      validation: null,
      successMessage: null,
      progress: null,
      achievements: [],
      playlistMode: PlaylistMode.multi,
      selectedSlugs: [],
      hasRestoredPrefs: false,
      timerEnabled: false,
      elapsedMs: 0,
      code: '',
      initialCode: '',
      isFullscreen: false,
      languageGlitchKey: 0,
      toasts: [],
      showConfetti: false,
      errorMessage: null,
    );
  }

  HomeState copyWith({
    bool? isLoading,
    bool? isValidating,
    bool? isCompleting,
    List<Language>? languages,
    Map<String, LanguageDetail>? languageMap,
    String? selectedSlug,
    Object? selectedLessonId = _sentinel,
    Object? lessonDetail = _sentinel,
    Object? validation = _sentinel,
    Object? successMessage = _sentinel,
    Object? progress = _sentinel,
    List<Achievement>? achievements,
    PlaylistMode? playlistMode,
    List<String>? selectedSlugs,
    bool? hasRestoredPrefs,
    bool? timerEnabled,
    int? elapsedMs,
    String? code,
    String? initialCode,
    bool? isFullscreen,
    int? languageGlitchKey,
    List<ToastMessage>? toasts,
    bool? showConfetti,
    Object? errorMessage = _sentinel,
  }) {
    return HomeState(
      isLoading: isLoading ?? this.isLoading,
      isValidating: isValidating ?? this.isValidating,
      isCompleting: isCompleting ?? this.isCompleting,
      languages: languages ?? this.languages,
      languageMap: languageMap ?? this.languageMap,
      selectedSlug: selectedSlug ?? this.selectedSlug,
      selectedLessonId: selectedLessonId == _sentinel ? this.selectedLessonId : selectedLessonId as int?,
      lessonDetail: lessonDetail == _sentinel ? this.lessonDetail : lessonDetail as LessonDetail?,
      validation: validation == _sentinel ? this.validation : validation as ValidationResult?,
      successMessage: successMessage == _sentinel ? this.successMessage : successMessage as String?,
      progress: progress == _sentinel ? this.progress : progress as Progress?,
      achievements: achievements ?? this.achievements,
      playlistMode: playlistMode ?? this.playlistMode,
      selectedSlugs: selectedSlugs ?? this.selectedSlugs,
      hasRestoredPrefs: hasRestoredPrefs ?? this.hasRestoredPrefs,
      timerEnabled: timerEnabled ?? this.timerEnabled,
      elapsedMs: elapsedMs ?? this.elapsedMs,
      code: code ?? this.code,
      initialCode: initialCode ?? this.initialCode,
      isFullscreen: isFullscreen ?? this.isFullscreen,
      languageGlitchKey: languageGlitchKey ?? this.languageGlitchKey,
      toasts: toasts ?? this.toasts,
      showConfetti: showConfetti ?? this.showConfetti,
      errorMessage: errorMessage == _sentinel ? this.errorMessage : errorMessage as String?,
    );
  }
}
