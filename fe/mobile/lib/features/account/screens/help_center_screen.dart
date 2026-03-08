import 'package:flutter/material.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({super.key});

  static const _categories = [
    {'icon': Icons.shopping_bag_outlined, 'title': 'Order Issue'},
    {'icon': Icons.payment_outlined, 'title': 'Payment Issue'},
    {'icon': Icons.person_outline, 'title': 'Account Issue'},
    {'icon': Icons.build_outlined, 'title': 'Technical Issue'},
    {'icon': Icons.local_shipping_outlined, 'title': 'Delivery Issue'},
    {'icon': Icons.assignment_return_outlined, 'title': 'Return & Refund'},
    {'icon': Icons.chat_outlined, 'title': 'Contact Customer Service'},
  ];

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
                      child: Text('Help Center',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Categories
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(24),
                itemCount: _categories.length,
                separatorBuilder: (_, __) =>
                    const Divider(height: 1, color: AppColors.primary100),
                itemBuilder: (_, i) {
                  final cat = _categories[i];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(cat['icon'] as IconData,
                        size: 24, color: AppColors.primary900),
                    title: Text(cat['title'] as String,
                        style: AppTextStyles.b1Regular),
                    trailing: const Icon(Icons.chevron_right,
                        size: 20, color: AppColors.primary400),
                    onTap: () {
                      if ((cat['title'] as String)
                          .contains('Customer Service')) {
                        Navigator.pushNamed(
                            context, AppRoutes.customerService);
                      }
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
