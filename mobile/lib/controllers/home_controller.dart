import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';

import '../models/models.dart';
import '../models/playlist.dart';
import '../models/stats.dart';
import '../services/recode_api.dart';
import '../state/home_state.dart';
import '../state/toast_message.dart';
import '../utils/time_utils.dart';

class HomeController extends ChangeNotifier {
  HomeController({required RecodeApi api}) : _api = api, _state = HomeState.initial();

  final RecodeApi _api;
  HomeState _state;
  bool _disposed = false;
  bool _initialized = false;

  final Stopwatch _stopwatch = Stopwatch();
  Timer? _ticker;
  Timer? _confettiTimer;
  final Map<String, Timer> _toastTimers = {};
  int _lessonRequestId = 0;

  HomeState get state => _state;

  List<PlaylistItem> get playlist => buildPlaylist(_state.languageMap, _state.selectedSlugs);

  PlaylistItem? get selectedItem {
    if (_state.selectedLessonId == null) return null;
    for (final item in playlist) {
      if (item.lessonId == _state.selectedLessonId) return item;
    }
    return null;
  }

  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    await loadInitial();
  }

  Future<void> loadInitial() async {
    _setState(_state.copyWith(isLoading: true, errorMessage: null));
    try {
      final results = await Future.wait([
        _api.listLanguages(),
        _api.getProgress(),
        _api.listAchievements(),
      ]);
      final languages = results[0] as List<Language>;
      final progress = results[1] as Progress;
      final achievements = results[2] as List<Achievement>;

      _setState(
        _state.copyWith(
          languages: languages,
          progress: progress,
          achievements: achievements,
        ),
      );

      await _loadLanguageDetails(languages);
      await _restorePreferences(languages);
    } catch (_) {
      _setState(
        _state.copyWith(errorMessage: 'Unable to load data. Is the backend running?'),
      );
    } finally {
      _setState(_state.copyWith(isLoading: false));
    }
  }

  void clearError() {
    if (_state.errorMessage == null) return;
    _setState(_state.copyWith(errorMessage: null));
  }

  Future<void> _loadLanguageDetails(List<Language> languages) async {
    if (languages.isEmpty) return;
    try {
      final entries = await Future.wait(
        languages.map((lang) async => MapEntry(lang.slug, await _api.getLanguage(lang.slug))),
      );
      _setState(_state.copyWith(languageMap: {for (final entry in entries) entry.key: entry.value}));
      _ensureSelection();
    } catch (_) {
      _setState(_state.copyWith(errorMessage: 'Unable to load lesson data. Please try again.'));
    }
  }

  Future<void> _restorePreferences(List<Language> languages) async {
    if (_state.hasRestoredPrefs || languages.isEmpty) return;
    final available = languages.map((lang) => lang.slug).toSet();
    final defaultSlug = languages.first.slug;

    LanguagePreferences prefs;
    try {
      prefs = await _api.getLanguagePreferences();
    } catch (_) {
      prefs = LanguagePreferences(
        playlistMode: 'multi',
        selectedSlugs: [defaultSlug],
        selectedSlug: defaultSlug,
      );
    }

    final mode = prefs.playlistMode == 'all' ? PlaylistMode.all : PlaylistMode.multi;
    final filtered = prefs.selectedSlugs.where(available.contains).toList();
    final nextSlugs = filtered.isNotEmpty ? filtered : [defaultSlug];
    var nextSelected = prefs.selectedSlug != null && available.contains(prefs.selectedSlug)
        ? prefs.selectedSlug
        : null;
    nextSelected ??= nextSlugs.isNotEmpty ? nextSlugs.first : defaultSlug;

    _setState(
      _state.copyWith(
        playlistMode: mode,
        selectedSlugs: nextSlugs,
        selectedSlug: nextSelected ?? defaultSlug,
        hasRestoredPrefs: true,
      ),
    );

    _persistPreferences();
    _ensureSelection();
  }

  void _persistPreferences() {
    if (!_state.hasRestoredPrefs) return;
    final prefs = LanguagePreferences(
      playlistMode: _state.playlistMode == PlaylistMode.all ? 'all' : 'multi',
      selectedSlugs: _state.selectedSlugs,
      selectedSlug: _state.selectedSlug.isEmpty ? null : _state.selectedSlug,
    );
    _api.setLanguagePreferences(prefs).catchError((_) {});
  }

  void _ensureSelection() {
    final items = playlist;
    if (items.isEmpty) return;
    final alreadySelected = _state.selectedLessonId != null &&
        items.any((item) => item.lessonId == _state.selectedLessonId);
    if (alreadySelected) return;
    final first = items.first;
    selectLessonById(first.lessonId, first.languageSlug);
  }

  void selectLessonById(int lessonId, String languageSlug) {
    _setState(
      _state.copyWith(
        selectedLessonId: lessonId,
        selectedSlug: languageSlug,
        validation: null,
        successMessage: null,
        languageGlitchKey: _state.languageGlitchKey + 1,
      ),
    );
    _persistPreferences();
    _fetchLessonDetail(lessonId, languageSlug);
  }

  Future<void> _fetchLessonDetail(int lessonId, String languageSlug) async {
    final requestId = ++_lessonRequestId;
    LessonDetail detail;
    try {
      detail = await _api.getLesson(lessonId);
    } catch (_) {
      _setState(_state.copyWith(errorMessage: 'Unable to load lesson details.'));
      return;
    }
    if (_disposed || requestId != _lessonRequestId) return;
    final challenge = detail.challenges.isNotEmpty ? detail.challenges.first : null;
    final prompt = challenge?.prompt ?? '';
    final starter = challenge?.starterCode ?? '';
    final prefix = _commentPrefixForSlug(languageSlug);
    final instruction = prompt.isNotEmpty ? '$prefix$prompt' : '';
    final combined = instruction.isNotEmpty
        ? '$instruction\n\n$starter'.trimRight() + '\n'
        : starter;

    _stopTimer();
    _setState(
      _state.copyWith(
        lessonDetail: detail,
        validation: null,
        successMessage: null,
        code: combined,
        initialCode: combined,
        elapsedMs: 0,
      ),
    );
  }

  void toggleTimer() {
    final next = !_state.timerEnabled;
    _setState(_state.copyWith(timerEnabled: next));
    if (!next) {
      _stopTimer();
      _setState(_state.copyWith(elapsedMs: 0));
    }
  }

  void toggleFullscreen() {
    _setState(_state.copyWith(isFullscreen: !_state.isFullscreen));
  }

  void exitFullscreen() {
    if (!_state.isFullscreen) return;
    _setState(_state.copyWith(isFullscreen: false));
  }

  void updateCode(String value, {bool userInput = true}) {
    if (value == _state.code) return;
    if (userInput && _state.timerEnabled && !_stopwatch.isRunning && value != _state.initialCode) {
      _startTimer();
    }
    _setState(_state.copyWith(code: value));
  }

  void changeMode(PlaylistMode mode) {
    if (_state.playlistMode == mode) return;
    final nextSlugs = mode == PlaylistMode.multi
        ? (_state.selectedSlug.isNotEmpty ? [_state.selectedSlug] : <String>[])
        : _state.languages.map((lang) => lang.slug).toList();

    _setState(
      _state.copyWith(
        playlistMode: mode,
        selectedSlugs: nextSlugs,
      ),
    );
    _persistPreferences();
    _ensureSelection();
  }

  void toggleLanguage(String slug) {
    final selected = List<String>.from(_state.selectedSlugs);
    if (selected.contains(slug)) {
      selected.remove(slug);
      if (selected.isEmpty) return;
    } else {
      selected.add(slug);
    }

    var selectedSlug = _state.selectedSlug;
    if (!selected.contains(selectedSlug) && selected.isNotEmpty) {
      selectedSlug = selected.first;
    }
    final glitchKey = selectedSlug != _state.selectedSlug ? _state.languageGlitchKey + 1 : _state.languageGlitchKey;

    _setState(
      _state.copyWith(
        selectedSlugs: selected,
        selectedSlug: selectedSlug,
        languageGlitchKey: glitchKey,
      ),
    );
    _persistPreferences();
    _ensureSelection();
  }

  void changeLanguage(String slug) {
    var selectedSlugs = _state.selectedSlugs.where((item) => item != slug).toList();
    if (_state.playlistMode == PlaylistMode.all) {
      final all = _state.languages.map((lang) => lang.slug).where((item) => item != slug).toList();
      selectedSlugs = [slug, ...all];
    } else {
      selectedSlugs = [slug, ...selectedSlugs];
    }

    _setState(
      _state.copyWith(
        selectedSlug: slug,
        selectedSlugs: selectedSlugs,
        languageGlitchKey: _state.languageGlitchKey + 1,
      ),
    );
    _persistPreferences();

    final lessonId = _getFirstLessonIdForSlug(slug);
    if (lessonId != null) {
      selectLessonById(lessonId, slug);
    }
  }

  int? _getFirstLessonIdForSlug(String slug) {
    final detail = _state.languageMap[slug];
    if (detail == null || detail.lessons.isEmpty) return null;
    final sorted = [...detail.lessons]..sort((a, b) => a.orderIndex.compareTo(b.orderIndex));
    return sorted.first.id;
  }

  void selectPlaylistItem(String itemId) {
    final item = playlist.firstWhere(
      (entry) => entry.id == itemId,
      orElse: () => const PlaylistItem(
        id: '',
        lessonId: -1,
        languageSlug: '',
        languageName: '',
        title: '',
        summary: '',
        orderIndex: -1,
      ),
    );
    if (item.lessonId == -1) return;
    selectLessonById(item.lessonId, item.languageSlug);
  }

  Future<void> validate() async {
    final detail = _state.lessonDetail;
    final challenge = detail?.challenges.isNotEmpty == true ? detail!.challenges.first : null;
    if (detail == null || challenge == null) return;

    _setState(_state.copyWith(isValidating: true, successMessage: null));
    try {
      final durationMs = _state.timerEnabled && _stopwatch.isRunning
          ? max(1, _stopwatch.elapsedMilliseconds)
          : 0;
      final result = await _api.submitChallenge(challenge.id, _state.code, durationMs);
      _setState(_state.copyWith(validation: result));

      if (result.newBest) {
        final bestLabel = result.bestDurationMs == null
            ? 'New best time!'
            : 'New best time: ${formatDurationMs(result.bestDurationMs!)}';
        _pushToast(
          ToastMessage(
            id: 'best-${DateTime.now().microsecondsSinceEpoch}',
            kind: ToastKind.best,
            title: 'Personal Best',
            description: bestLabel,
          ),
        );
        _showConfetti();
      }

      if (result.isValid) {
        await completeLesson(detail.id);
        final nextItem = _findNextItem();
        if (nextItem != null) {
          _setState(_state.copyWith(successMessage: 'Looks good. Moving to the next activity.'));
          Future.delayed(const Duration(milliseconds: 1200), () {
            if (_disposed) return;
            selectLessonById(nextItem.lessonId, nextItem.languageSlug);
          });
        } else {
          _setState(_state.copyWith(successMessage: 'Great work. You finished this playlist.'));
        }
      } else {
        _setState(_state.copyWith(successMessage: null));
      }
    } catch (_) {
      _setState(_state.copyWith(errorMessage: 'Validation failed. Please try again.'));
    } finally {
      _setState(_state.copyWith(isValidating: false));
    }
  }

  Future<void> completeLesson(int lessonId) async {
    _setState(_state.copyWith(isCompleting: true));
    try {
      final response = await _api.completeLesson(lessonId);
      _setState(_state.copyWith(progress: response.progress));
      for (final achievement in response.newAchievements) {
        _pushToast(
          ToastMessage(
            id: 'ach-${achievement.id}-${DateTime.now().microsecondsSinceEpoch}',
            kind: ToastKind.achievement,
            title: achievement.title,
            description: achievement.description,
            iconKey: achievement.icon,
            points: achievement.points,
          ),
        );
      }
    } catch (_) {
      _setState(_state.copyWith(errorMessage: 'Unable to record completion.'));
    } finally {
      _setState(_state.copyWith(isCompleting: false));
    }
  }

  Future<StatsData> loadStats() async {
    final slugs = _state.selectedSlugs.isNotEmpty
        ? _state.selectedSlugs
        : _state.languages.map((lang) => lang.slug).toList();
    final results = await Future.wait([
      _api.listAttempts(slugs),
      _api.listBestScores(slugs),
    ]);
    return StatsData(
      attempts: results[0] as List<AttemptRead>,
      bestScores: results[1] as List<BestScoreRead>,
    );
  }

  void _pushToast(ToastMessage toast) {
    final updated = [..._state.toasts, toast];
    _setState(_state.copyWith(toasts: updated));
    _toastTimers[toast.id]?.cancel();
    _toastTimers[toast.id] = Timer(const Duration(seconds: 5), () {
      _hideToast(toast.id);
    });
  }

  void _hideToast(String id) {
    final toasts = _state.toasts
        .map((toast) => toast.id == id ? toast.copyWith(isVisible: false) : toast)
        .toList();
    _setState(_state.copyWith(toasts: toasts));

    _toastTimers[id]?.cancel();
    _toastTimers[id] = Timer(const Duration(milliseconds: 300), () {
      _removeToast(id);
    });
  }

  void _removeToast(String id) {
    final toasts = _state.toasts.where((toast) => toast.id != id).toList();
    _setState(_state.copyWith(toasts: toasts));
    _toastTimers.remove(id);
  }

  void _showConfetti() {
    _confettiTimer?.cancel();
    _setState(_state.copyWith(showConfetti: true));
    _confettiTimer = Timer(const Duration(milliseconds: 1600), () {
      _setState(_state.copyWith(showConfetti: false));
    });
  }

  PlaylistItem? _findNextItem() {
    final items = playlist;
    final selected = selectedItem;
    if (selected == null) return null;
    final index = items.indexWhere((item) => item.id == selected.id);
    if (index < 0) return null;
    return index + 1 < items.length ? items[index + 1] : null;
  }

  String _commentPrefixForSlug(String slug) {
    if (slug == 'python') return '# ';
    if (slug == 'sql') return '-- ';
    return '// ';
  }

  void _startTimer() {
    _stopwatch.start();
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(milliseconds: 50), (_) {
      _setState(_state.copyWith(elapsedMs: _stopwatch.elapsedMilliseconds));
    });
  }

  void _stopTimer() {
    _ticker?.cancel();
    _ticker = null;
    _stopwatch
      ..stop()
      ..reset();
  }

  void _setState(HomeState next) {
    if (_disposed) return;
    _state = next;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _ticker?.cancel();
    _confettiTimer?.cancel();
    for (final timer in _toastTimers.values) {
      timer.cancel();
    }
    _stopwatch.stop();
    super.dispose();
  }
}
