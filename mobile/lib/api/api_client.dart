import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/models.dart';
import '../services/recode_api.dart';

class ApiClient implements RecodeApi {
  ApiClient(this.baseUrl, {http.Client? client})
      : _client = client ?? http.Client();

  final String baseUrl;
  final http.Client _client;

  String get _base => baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;

  void dispose() {
    _client.close();
  }

  Future<dynamic> _request(
    String path, {
    String method = 'GET',
    Map<String, String>? headers,
    Object? body,
  }) async {
    final uri = Uri.parse('$_base$path');
    final request = http.Request(method, uri);
    if (headers != null) {
      request.headers.addAll(headers);
    }
    if (body != null) {
      request.body = body is String ? body : jsonEncode(body);
    }
    final response = await _client.send(request);
    final responseBody = await response.stream.bytesToString();
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw HttpException('Request failed: ${response.statusCode}', responseBody);
    }
    if (responseBody.isEmpty) {
      return null;
    }
    return jsonDecode(responseBody);
  }

  Future<List<Language>> listLanguages() async {
    final data = await _request('/api/languages') as List<dynamic>;
    return data.map((item) => Language.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<LanguageDetail> getLanguage(String slug) async {
    final data = await _request('/api/languages/$slug') as Map<String, dynamic>;
    return LanguageDetail.fromJson(data);
  }

  Future<LessonDetail> getLesson(int lessonId) async {
    final data = await _request('/api/lessons/$lessonId') as Map<String, dynamic>;
    return LessonDetail.fromJson(data);
  }

  Future<List<Achievement>> listAchievements() async {
    final data = await _request('/api/achievements') as List<dynamic>;
    return data.map((item) => Achievement.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<Progress> getProgress() async {
    final data = await _request('/api/progress') as Map<String, dynamic>;
    return Progress.fromJson(data);
  }

  Future<LanguagePreferences> getLanguagePreferences() async {
    final data = await _request('/api/preferences/languages') as Map<String, dynamic>;
    return LanguagePreferences.fromJson(data);
  }

  Future<LanguagePreferences> setLanguagePreferences(LanguagePreferences prefs) async {
    final data = await _request(
      '/api/preferences/languages',
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: prefs.toJson(),
    ) as Map<String, dynamic>;
    return LanguagePreferences.fromJson(data);
  }

  Future<CompletionResponse> completeLesson(int lessonId) async {
    final data = await _request('/api/lessons/$lessonId/complete', method: 'POST') as Map<String, dynamic>;
    return CompletionResponse.fromJson(data);
  }

  Future<ValidationResult> submitChallenge(int challengeId, String code, int durationMs) async {
    final data = await _request(
      '/api/challenges/$challengeId/submit',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: {
        'code': code,
        'duration_ms': durationMs,
      },
    ) as Map<String, dynamic>;
    return ValidationResult.fromJson(data);
  }

  Future<List<AttemptRead>> listAttempts(List<String> slugs) async {
    final query = slugs.isEmpty ? '' : '?languages=${slugs.join(',')}';
    final data = await _request('/api/stats/attempts$query') as List<dynamic>;
    return data.map((item) => AttemptRead.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<BestScoreRead>> listBestScores(List<String> slugs) async {
    final query = slugs.isEmpty ? '' : '?languages=${slugs.join(',')}';
    final data = await _request('/api/stats/best$query') as List<dynamic>;
    return data.map((item) => BestScoreRead.fromJson(item as Map<String, dynamic>)).toList();
  }
}

class HttpException implements Exception {
  HttpException(this.message, this.body);

  final String message;
  final String? body;

  @override
  String toString() => message;
}
