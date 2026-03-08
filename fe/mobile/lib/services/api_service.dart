import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  static const String _fallbackBaseUrl = 'http://localhost:3000/api/v1';
  final http.Client _client;

  Map<String, String> get _headers => const {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  String get baseUrl {
    final configured = dotenv.env['API_BASE_URL'] ?? _fallbackBaseUrl;
    final parsed = Uri.tryParse(configured);
    if (parsed == null) {
      return _fallbackBaseUrl;
    }

    if (!kIsWeb && Platform.isAndroid && _isLocalHost(parsed.host)) {
      return parsed.replace(host: '10.0.2.2').toString();
    }

    return parsed.toString();
  }

  bool _isLocalHost(String host) => host == 'localhost' || host == '127.0.0.1';

  Future<ApiResult<Map<String, dynamic>>> register(
    Map<String, dynamic> payload,
  ) {
    return _post('/auth/register', body: payload);
  }

  Future<ApiResult<Map<String, dynamic>>> login({
    required String email,
    required String password,
  }) {
    return _post('/auth/login', body: {'email': email, 'password': password});
  }

  Future<ApiResult<Map<String, dynamic>>> refreshToken(String refreshToken) {
    return _post('/auth/refresh', headers: {'x-refresh-token': refreshToken});
  }

  Future<ApiResult<Map<String, dynamic>>> logout(String refreshToken) {
    return _post('/auth/logout', headers: {'x-refresh-token': refreshToken});
  }

  Future<ApiResult<Map<String, dynamic>>> sendVerificationCode(String email) {
    return _post('/send-verification-code', body: {'email': email});
  }

  Future<ApiResult<Map<String, dynamic>>> verifyCode(String code) {
    return _post('/verify-code', body: {'code': code});
  }

  // ── Products ──────────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> getProducts({
    int page = 1,
    int limit = 10,
    String sortBy = 'createdAt',
    String sortOrder = 'desc',
  }) {
    return _get(
      '/products?page=$page&limit=$limit&sortBy=$sortBy&sortOrder=$sortOrder',
    );
  }

  Future<ApiResult<Map<String, dynamic>>> getProductById(String productId) {
    return _get('/products/$productId');
  }

  // ── Cart ──────────────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> addToCart({
    required String accessToken,
    required Map<String, dynamic> body,
  }) {
    return _post('/cart', body: body, headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> getCart({
    required String accessToken,
    required String userId,
  }) {
    return _get('/cart/$userId', headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> updateCartQuantity({
    required String accessToken,
    required Map<String, dynamic> body,
  }) {
    return _put('/cart', body: body, headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> removeCartItem({
    required String accessToken,
    required Map<String, dynamic> body,
  }) {
    return _delete('/cart', body: body, headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> clearCart({
    required String accessToken,
    required String userId,
  }) {
    return _delete(
      '/cart/clear',
      body: {'userId': userId},
      headers: _authHeader(accessToken),
    );
  }

  // ── Orders ────────────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> createOrder({
    required String accessToken,
    required Map<String, dynamic> body,
  }) {
    return _post('/order', body: body, headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> getOrdersByUser({
    required String accessToken,
    required String userId,
  }) {
    return _get('/order/users/$userId', headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> getOrderById({
    required String accessToken,
    required String orderId,
  }) {
    return _get('/order/$orderId', headers: _authHeader(accessToken));
  }

  // ── Wishlist ──────────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> getWishlist({
    required String accessToken,
  }) {
    return _get('/wishlist', headers: _authHeader(accessToken));
  }

  Future<ApiResult<Map<String, dynamic>>> addToWishlist({
    required String accessToken,
    required String productId,
    required String variantId,
  }) {
    return _post(
      '/wishlist',
      body: {'productId': productId, 'variantId': variantId},
      headers: _authHeader(accessToken),
    );
  }

  Future<ApiResult<Map<String, dynamic>>> removeFromWishlist({
    required String accessToken,
    required String productId,
  }) {
    return _delete(
      '/wishlist',
      body: {'productId': productId},
      headers: _authHeader(accessToken),
    );
  }

  // ── Payments ──────────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> createPayment({
    required String accessToken,
    required Map<String, dynamic> body,
  }) {
    return _post('/payment', body: body, headers: _authHeader(accessToken));
  }

  Map<String, String> _authHeader(String token) =>
      {'Authorization': 'Bearer $token'};

  // ── HTTP Methods ──────────────────────────────────────────────────

  Future<ApiResult<Map<String, dynamic>>> _get(
    String path, {
    Map<String, String>? headers,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final response = await _client
          .get(
            uri,
            headers: {..._headers, if (headers != null) ...headers},
          )
          .timeout(const Duration(seconds: 20));
      return _parseResponse(response);
    } on SocketException {
      return ApiResult.error(
        'Unable to connect to server. Check your network.',
      );
    } on http.ClientException {
      return ApiResult.error('Failed to reach API service.');
    } catch (error) {
      return ApiResult.error('Unexpected error: $error');
    }
  }

  Future<ApiResult<Map<String, dynamic>>> _put(
    String path, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final response = await _client
          .put(
            uri,
            headers: {..._headers, if (headers != null) ...headers},
            body: body == null ? null : jsonEncode(body),
          )
          .timeout(const Duration(seconds: 20));
      return _parseResponse(response);
    } on SocketException {
      return ApiResult.error(
        'Unable to connect to server. Check your network.',
      );
    } on http.ClientException {
      return ApiResult.error('Failed to reach API service.');
    } catch (error) {
      return ApiResult.error('Unexpected error: $error');
    }
  }

  Future<ApiResult<Map<String, dynamic>>> _delete(
    String path, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = http.Request('DELETE', uri);
      request.headers.addAll({..._headers, if (headers != null) ...headers});
      if (body != null) request.body = jsonEncode(body);

      final streamed =
          await _client.send(request).timeout(const Duration(seconds: 20));
      final response = await http.Response.fromStream(streamed);
      return _parseResponse(response);
    } on SocketException {
      return ApiResult.error(
        'Unable to connect to server. Check your network.',
      );
    } on http.ClientException {
      return ApiResult.error('Failed to reach API service.');
    } catch (error) {
      return ApiResult.error('Unexpected error: $error');
    }
  }

  Future<ApiResult<Map<String, dynamic>>> _post(
    String path, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final response = await _client
          .post(
            uri,
            headers: {..._headers, if (headers != null) ...headers},
            body: body == null ? null : jsonEncode(body),
          )
          .timeout(const Duration(seconds: 20));

      return _parseResponse(response);
    } on SocketException {
      return ApiResult.error(
        'Unable to connect to server. Check your network.',
      );
    } on http.ClientException {
      return ApiResult.error('Failed to reach API service.');
    } on FormatException {
      return ApiResult.error('Invalid response format.');
    } catch (error) {
      return ApiResult.error('Unexpected error: $error');
    }
  }

  ApiResult<Map<String, dynamic>> _parseResponse(http.Response response) {
    Map<String, dynamic> jsonBody = {};

    if (response.body.isNotEmpty) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        jsonBody = decoded;
      }
    }

    final bool ok = response.statusCode >= 200 && response.statusCode < 300;

    if (ok) {
      return ApiResult.success(
        data: jsonBody,
        message: _extractMessage(jsonBody) ?? 'Success',
      );
    }

    return ApiResult.error(
      _extractMessage(jsonBody) ?? 'Request failed (${response.statusCode})',
      statusCode: response.statusCode,
      fieldErrors: _extractFieldErrors(jsonBody),
      rawData: jsonBody,
    );
  }

  String? _extractMessage(Map<String, dynamic> body) {
    final message = body['message'] ?? body['error'];

    if (message is String && message.trim().isNotEmpty) {
      return message;
    }

    if (message is List) {
      return message.join(', ');
    }

    return null;
  }

  Map<String, String> _extractFieldErrors(Map<String, dynamic> body) {
    final errors = body['errors'];

    if (errors is List) {
      final fieldErrors = <String, String>{};
      for (final entry in errors) {
        if (entry is Map<String, dynamic>) {
          final field = (entry['field'] ?? entry['path'] ?? '').toString();
          final message = (entry['message'] ?? entry['msg'] ?? '').toString();
          if (field.isNotEmpty && message.isNotEmpty) {
            fieldErrors[field] = message;
          }
        }
      }
      return fieldErrors;
    }

    if (errors is Map<String, dynamic>) {
      return errors.map((key, value) => MapEntry(key, value.toString()));
    }

    return {};
  }
}

class ApiResult<T> {
  const ApiResult._({
    required this.isSuccess,
    this.data,
    this.message,
    this.statusCode,
    this.fieldErrors = const {},
    this.rawData,
  });

  final bool isSuccess;
  final T? data;
  final String? message;
  final int? statusCode;
  final Map<String, String> fieldErrors;
  final Map<String, dynamic>? rawData;

  factory ApiResult.success({required T data, String? message}) {
    return ApiResult._(isSuccess: true, data: data, message: message);
  }

  factory ApiResult.error(
    String message, {
    int? statusCode,
    Map<String, String> fieldErrors = const {},
    Map<String, dynamic>? rawData,
  }) {
    return ApiResult._(
      isSuccess: false,
      message: message,
      statusCode: statusCode,
      fieldErrors: fieldErrors,
      rawData: rawData,
    );
  }
}
