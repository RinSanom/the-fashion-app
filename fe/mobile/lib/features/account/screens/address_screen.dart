import 'package:flutter/material.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/widgets/app_button.dart';

class AddressScreen extends StatefulWidget {
  const AddressScreen({super.key});

  @override
  State<AddressScreen> createState() => _AddressScreenState();
}

class _AddressScreenState extends State<AddressScreen> {
  int _selectedIndex = 0;

  final List<Map<String, String>> _addresses = [
    {
      'label': 'Home',
      'address': '123 Main Street, Phnom Penh, Cambodia 12000',
    },
    {
      'label': 'Office',
      'address': '456 Business Ave, Phnom Penh, Cambodia 12100',
    },
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
                      child: Text('Address',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Addresses list
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(24),
                itemCount: _addresses.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (_, i) {
                  final addr = _addresses[i];
                  final isSelected = i == _selectedIndex;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedIndex = i),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primary900
                              : AppColors.primary100,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.location_on_outlined,
                              size: 24, color: AppColors.primary500),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(addr['label']!,
                                        style: AppTextStyles.b1Medium
                                            .copyWith(fontSize: 14)),
                                    if (i == 0) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary900,
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        child: Text('Default',
                                            style: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontSize: 10,
                                              color: AppColors.primary0,
                                              fontWeight: FontWeight.w500,
                                            )),
                                      ),
                                    ],
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(addr['address']!,
                                    style: AppTextStyles.b2Regular.copyWith(
                                        color: AppColors.primary500),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis),
                              ],
                            ),
                          ),
                          Radio<int>(
                            value: i,
                            groupValue: _selectedIndex,
                            onChanged: (v) =>
                                setState(() => _selectedIndex = v!),
                            activeColor: AppColors.primary900,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Buttons
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 8),
              child: AppButton(
                label: 'Add New Address',
                backgroundColor: AppColors.primary0,
                foregroundColor: AppColors.primary900,
                borderSide: const BorderSide(color: AppColors.primary900),
                onPressed: () {},
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: AppButton(
                label: 'Save',
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
