import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../controllers/home_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/achievements_sheet.dart';
import '../widgets/app_background.dart';
import '../widgets/confetti_burst.dart';
import '../widgets/editor_panel.dart';
import '../widgets/playlist_sidebar.dart';
import '../widgets/stats_sheet.dart';
import '../widgets/status_bar.dart';
import '../widgets/toast_stack.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.controller});

  final HomeController controller;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late final TextEditingController _codeController;
  late HomeController _controller;
  bool _isSyncingCode = false;
  late final AnimationController _pageController;
  late final Animation<double> _headerOpacity;
  late final Animation<Offset> _headerSlide;
  late final Animation<double> _sidebarOpacity;
  late final Animation<Offset> _sidebarSlide;
  late final Animation<double> _editorOpacity;
  late final Animation<Offset> _editorSlide;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller;
    _codeController = TextEditingController(text: _controller.state.code);
    _controller.addListener(_onControllerChanged);
    _controller.initialize();

    _pageController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _headerOpacity = CurvedAnimation(
      parent: _pageController,
      curve: const Interval(0.0, 0.35, curve: Curves.easeOut),
    );
    _headerSlide = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _pageController, curve: const Interval(0.0, 0.35, curve: Curves.easeOut)),
    );
    _sidebarOpacity = CurvedAnimation(
      parent: _pageController,
      curve: const Interval(0.2, 0.6, curve: Curves.easeOut),
    );
    _sidebarSlide = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _pageController, curve: const Interval(0.2, 0.6, curve: Curves.easeOut)),
    );
    _editorOpacity = CurvedAnimation(
      parent: _pageController,
      curve: const Interval(0.35, 0.85, curve: Curves.easeOut),
    );
    _editorSlide = Tween<Offset>(
      begin: const Offset(0, 0.06),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _pageController, curve: const Interval(0.35, 0.85, curve: Curves.easeOut)),
    );
    _pageController.forward();
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _codeController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _onControllerChanged() {
    if (!mounted) return;
    final state = _controller.state;
    if (state.errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage!)),
      );
      _controller.clearError();
    }

    if (state.code != _codeController.text) {
      _isSyncingCode = true;
      _codeController.text = state.code;
      _codeController.selection = TextSelection.collapsed(offset: state.code.length);
      Future.microtask(() {
        _isSyncingCode = false;
      });
    }
    setState(() {});
  }

  void _openStats() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatsSheet(controller: _controller),
    );
  }

  void _openAchievements() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AchievementsSheet(achievements: _controller.state.achievements),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = _controller.state;

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 900;
        final playlist = _controller.playlist;
        final selectedItem = _controller.selectedItem;

        Widget stagger({
          required Animation<double> opacity,
          required Animation<Offset> slide,
          required Widget child,
        }) {
          return FadeTransition(
            opacity: opacity,
            child: SlideTransition(position: slide, child: child),
          );
        }

        EditorPanel buildEditor({required bool isFullscreen}) {
          return EditorPanel(
            lessonDetail: state.lessonDetail,
            challenge: state.lessonDetail?.challenges.isNotEmpty == true
                ? state.lessonDetail!.challenges.first
                : null,
            languages: state.languages,
            selectedSlug: state.selectedSlug.isEmpty ? null : state.selectedSlug,
            languageGlitchKey: state.languageGlitchKey,
            onLanguageChange: _controller.changeLanguage,
            codeController: _codeController,
            onCodeChanged: (value) {
              if (_isSyncingCode) return;
              _controller.updateCode(value, userInput: true);
            },
            onValidate: _controller.validate,
            validation: state.validation,
            isValidating: state.isValidating || state.isCompleting,
            successMessage: state.successMessage,
            timerEnabled: state.timerEnabled,
            timerMs: state.elapsedMs,
            onToggleTimer: _controller.toggleTimer,
            isFullscreen: isFullscreen,
            onToggleFullscreen: _controller.toggleFullscreen,
          );
        }

        final editorPanel = state.isFullscreen ? const SizedBox.shrink() : buildEditor(isFullscreen: false);

        return Scaffold(
          key: _scaffoldKey,
          drawer: isWide
              ? null
              : Drawer(
                  backgroundColor: Colors.transparent,
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: PlaylistSidebar(
                        languages: state.languages,
                        playlist: playlist,
                        selectedItemId: selectedItem?.id,
                        onSelectItem: (id) {
                          Navigator.of(context).pop();
                          _controller.selectPlaylistItem(id);
                        },
                        isLoading: state.isLoading,
                        playlistMode: state.playlistMode,
                        selectedSlugs: state.selectedSlugs,
                        onToggleLanguage: _controller.toggleLanguage,
                        onChangeMode: _controller.changeMode,
                      ),
                    ),
                  ),
                ),
          body: Stack(
            children: [
              const AppBackground(),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Column(
                    children: [
                      stagger(
                        opacity: _headerOpacity,
                        slide: _headerSlide,
                        child: StatusBar(
                          progress: state.progress,
                          onOpenStats: _openStats,
                          onOpenAchievements: _openAchievements,
                          onOpenMenu: isWide
                              ? null
                              : () {
                                  _scaffoldKey.currentState?.openDrawer();
                                },
                        ),
                      ),
                      const SizedBox(height: 20),
                      Expanded(
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 350),
                          switchInCurve: Curves.easeOut,
                          switchOutCurve: Curves.easeIn,
                          transitionBuilder: (child, animation) {
                            final slide = Tween<Offset>(
                              begin: const Offset(0, 0.05),
                              end: Offset.zero,
                            ).animate(animation);
                            return FadeTransition(
                              opacity: animation,
                              child: SlideTransition(position: slide, child: child),
                            );
                          },
                          child: isWide
                              ? Row(
                                  key: ValueKey('wide-${state.selectedLessonId}'),
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    stagger(
                                      opacity: _sidebarOpacity,
                                      slide: _sidebarSlide,
                                      child: SizedBox(
                                        width: 320,
                                        child: PlaylistSidebar(
                                          languages: state.languages,
                                          playlist: playlist,
                                          selectedItemId: selectedItem?.id,
                                          onSelectItem: _controller.selectPlaylistItem,
                                          isLoading: state.isLoading,
                                          playlistMode: state.playlistMode,
                                          selectedSlugs: state.selectedSlugs,
                                          onToggleLanguage: _controller.toggleLanguage,
                                          onChangeMode: _controller.changeMode,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 20),
                                    Expanded(
                                      child: stagger(
                                        opacity: _editorOpacity,
                                        slide: _editorSlide,
                                        child: editorPanel,
                                      ),
                                    ),
                                  ],
                                )
                              : Container(
                                  key: ValueKey('narrow-${state.selectedLessonId}'),
                                  child: stagger(
                                    opacity: _editorOpacity,
                                    slide: _editorSlide,
                                    child: editorPanel,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned.fill(
                child: IgnorePointer(
                  ignoring: !state.isFullscreen,
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 250),
                    opacity: state.isFullscreen ? 1 : 0,
                    child: Container(
                      color: AppColors.ink.withOpacity(0.96),
                      child: SafeArea(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Focus(
                            autofocus: true,
                            onKey: (node, event) {
                              if (event is RawKeyDownEvent &&
                                  event.logicalKey == LogicalKeyboardKey.escape) {
                                _controller.exitFullscreen();
                                return KeyEventResult.handled;
                              }
                              return KeyEventResult.ignored;
                            },
                            child: buildEditor(isFullscreen: true),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              ToastStack(toasts: state.toasts, isWide: isWide),
              if (state.showConfetti) const ConfettiBurst(),
            ],
          ),
        );
      },
    );
  }
}
