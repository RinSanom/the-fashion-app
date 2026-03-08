import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/widgets/app_button.dart';

class VerificationArgs {
  const VerificationArgs({required this.email});

  final String email;
}

class VerificationScreen extends ConsumerStatefulWidget {
  const VerificationScreen({super.key, this.email});

  final String? email;

  @override
  ConsumerState<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends ConsumerState<VerificationScreen> {
  static const int _codeLength = 6;

  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(_codeLength, (_) => TextEditingController());
    _focusNodes = List.generate(_codeLength, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    for (final node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  String get _otpCode =>
      _controllers.map((controller) => controller.text).join();

  bool get _canVerify =>
      _controllers.every((controller) => controller.text.trim().isNotEmpty);

  void _onCodeChanged(int index, String value) {
    if (value.isNotEmpty && index < _codeLength - 1) {
      _focusNodes[index + 1].requestFocus();
    }

    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    ref.read(authStateProvider.notifier).clearFeedback();
    setState(() {});
  }

  Future<void> _verify() async {
    FocusScope.of(context).unfocus();

    if (!_canVerify) {
      return;
    }

    final result = await ref
        .read(authStateProvider.notifier)
        .verifyCode(_otpCode);

    if (!mounted || !result.isSuccess) {
      return;
    }

    Navigator.of(context).pushNamed(AppRoutes.resetPassword);
  }

  Future<void> _resendCode(String email) async {
    final result = await ref
        .read(authStateProvider.notifier)
        .sendVerificationCode(email);
    if (!mounted) {
      return;
    }

    final message =
        result.message ??
        (result.isSuccess
            ? 'Verification code sent again.'
            : 'Unable to resend code.');

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: result.isSuccess ? AppColors.success : AppColors.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final isSubmitting = authState.isSubmitting;

    final email = widget.email ?? authState.verificationEmail;

    return Scaffold(
      backgroundColor: AppColors.primary0,
      appBar: AppBar(
        backgroundColor: AppColors.primary0,
        elevation: 0,
        leading: IconButton(
          onPressed: isSubmitting ? null : () => Navigator.of(context).pop(),
          icon: const Icon(Icons.arrow_back, color: AppColors.primary900),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 6, 24, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Enter 6 Digit Code', style: AppTextStyles.h2SemiBold),
              const SizedBox(height: 10),
              Text(
                email == null
                    ? 'Enter the verification code sent to your email.'
                    : 'Enter the code sent to $email.',
                style: AppTextStyles.b1Regular.copyWith(
                  color: AppColors.primary500,
                ),
              ),
              const SizedBox(height: 28),
              if (authState.errorMessage != null) ...[
                _InlineMessage(
                  text: authState.errorMessage!,
                  color: AppColors.error,
                ),
                const SizedBox(height: 16),
              ],
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(
                  _codeLength,
                  (index) => SizedBox(
                    width: 48,
                    height: 60,
                    child: TextField(
                      controller: _controllers[index],
                      focusNode: _focusNodes[index],
                      enabled: !isSubmitting,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.b1Medium,
                      maxLength: 1,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      decoration: InputDecoration(
                        counterText: '',
                        contentPadding: EdgeInsets.zero,
                        hintText: '0',
                        hintStyle: AppTextStyles.b1Regular.copyWith(
                          color: AppColors.primary400,
                        ),
                      ),
                      onChanged: (value) => _onCodeChanged(index, value),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Align(
                alignment: Alignment.center,
                child: TextButton(
                  onPressed: (email == null || isSubmitting)
                      ? null
                      : () => _resendCode(email),
                  child: RichText(
                    text: TextSpan(
                      style: AppTextStyles.b2Regular.copyWith(
                        color: AppColors.primary500,
                      ),
                      children: [
                        const TextSpan(text: 'Email not received? '),
                        TextSpan(
                          text: 'Resend code',
                          style: AppTextStyles.b2Regular.copyWith(
                            color: AppColors.primary900,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const Spacer(),
              AppButton(
                label: 'Verify',
                onPressed: _verify,
                isLoading: isSubmitting,
                enabled: _canVerify && !isSubmitting,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InlineMessage extends StatelessWidget {
  const _InlineMessage({required this.text, required this.color});

  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(text, style: AppTextStyles.b2Regular.copyWith(color: color)),
    );
  }
}
