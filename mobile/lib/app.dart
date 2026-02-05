import 'package:flutter/material.dart';

import 'api/api_client.dart';
import 'config.dart';
import 'controllers/home_controller.dart';
import 'screens/home_screen.dart';
import 'services/recode_api.dart';
import 'theme/app_theme.dart';

class RecodeApp extends StatefulWidget {
  const RecodeApp({
    super.key,
    this.api,
    this.controller,
  });

  final RecodeApi? api;
  final HomeController? controller;

  @override
  State<RecodeApp> createState() => _RecodeAppState();
}

class _RecodeAppState extends State<RecodeApp> {
  late final HomeController _controller;
  late final bool _ownsController;

  @override
  void initState() {
    super.initState();
    if (widget.controller != null) {
      _controller = widget.controller!;
      _ownsController = false;
    } else {
      final api = widget.api ?? ApiClient(AppConfig.apiBaseUrl);
      _controller = HomeController(api: api);
      _ownsController = true;
    }
  }

  @override
  void dispose() {
    if (_ownsController) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recode',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: HomeScreen(controller: _controller),
    );
  }
}
