import 'package:flutter/material.dart';

class TheFashionApp extends StatelessWidget {
  const TheFashionApp._internal();

  static final TheFashionApp instance = TheFashionApp._internal();

  factory TheFashionApp() => instance;

  @override
  Widget build(BuildContext context) {
    return MaterialApp();
  }
}
