import 'package:flutter_test/flutter_test.dart';

import 'package:recode_mobile/controllers/home_controller.dart';
import 'package:recode_mobile/models/playlist.dart';
import 'package:recode_mobile/testing/fake_api.dart';

void main() {
  test('loadInitial populates data and selects a lesson', () async {
    final controller = HomeController(api: FakeRecodeApi());
    await controller.loadInitial();

    expect(controller.state.languages.isNotEmpty, true);
    expect(controller.playlist.isNotEmpty, true);
    expect(controller.state.selectedLessonId, isNotNull);

    controller.dispose();
  });

  test('toggleLanguage keeps at least one selection', () async {
    final controller = HomeController(api: FakeRecodeApi());
    await controller.loadInitial();

    final original = controller.state.selectedSlugs.first;
    controller.toggleLanguage(original);

    expect(controller.state.selectedSlugs.isNotEmpty, true);

    controller.dispose();
  });

  test('changeMode to all selects all languages', () async {
    final controller = HomeController(api: FakeRecodeApi());
    await controller.loadInitial();

    controller.changeMode(PlaylistMode.all);
    expect(controller.state.selectedSlugs.length, controller.state.languages.length);

    controller.dispose();
  });

  test('validate marks success and triggers toast', () async {
    final controller = HomeController(api: FakeRecodeApi());
    await controller.loadInitial();

    final challenge = controller.state.lessonDetail!.challenges.first;
    controller.updateCode(challenge.solutionCode, userInput: true);
    await controller.validate();

    expect(controller.state.validation?.isValid, true);
    expect(controller.state.toasts.isNotEmpty, true);
    expect(controller.state.successMessage, isNotNull);

    controller.dispose();
  });
}
