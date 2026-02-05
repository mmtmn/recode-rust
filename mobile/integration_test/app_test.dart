import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:recode_mobile/app.dart';
import 'package:recode_mobile/testing/fake_api.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('complete a lesson flow', (tester) async {
    await tester.pumpWidget(RecodeApp(api: FakeRecodeApi()));
    await tester.pumpAndSettle();

    expect(find.textContaining('Phase 1: Absolute Basics A'), findsWidgets);

    await tester.enterText(find.byType(TextField).first, 'print("hello")\n');
    await tester.tap(find.text('Validate Syntax'));
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.textContaining('Looks good'), findsWidgets);
  });
}
