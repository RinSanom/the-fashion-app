import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/widgets/app_button.dart';
import 'package:mobile/widgets/app_text_field.dart';

class MyDetailsScreen extends ConsumerStatefulWidget {
  const MyDetailsScreen({super.key});

  @override
  ConsumerState<MyDetailsScreen> createState() => _MyDetailsScreenState();
}

class _MyDetailsScreenState extends ConsumerState<MyDetailsScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final authState = ref.read(authStateProvider);
    _emailController.text = authState.verificationEmail ?? '';
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary0,
      body: SafeArea(
        child: Column(
          children: [
            // App bar
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 12, 24, 0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back, size: 24),
                  ),
                  Expanded(
                    child: Center(
                      child: Text('My Details',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Form
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    AppTextField(
                      label: 'First Name',
                      controller: _firstNameController,
                      hintText: 'Enter first name',
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Last Name',
                      controller: _lastNameController,
                      hintText: 'Enter last name',
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Email',
                      controller: _emailController,
                      hintText: 'Enter email',
                      enabled: false,
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Date of Birth',
                      controller: _dobController,
                      hintText: 'DD/MM/YYYY',
                      suffixIcon: const Icon(Icons.calendar_today_outlined,
                          size: 20, color: AppColors.primary400),
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Phone Number',
                      controller: _phoneController,
                      hintText: 'Enter phone number',
                      keyboardType: TextInputType.phone,
                    ),
                  ],
                ),
              ),
            ),

            // Save button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: AppButton(
                label: 'Save Changes',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Details saved!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
