import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/providers/cart_provider.dart';
import 'package:mobile/providers/order_provider.dart';
import 'package:mobile/widgets/app_button.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  int _selectedPayment = 0; // 0=Card, 1=Cash
  final _promoController = TextEditingController();
  bool _isPlacingOrder = false;

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    final cart = ref.read(cartProvider).cart;
    if (cart.isEmpty) return;

    setState(() => _isPlacingOrder = true);

    final items = cart.items
        .map((item) => item.toJson())
        .toList();

    final delivery = {
      'courier': 'Standard',
      'address': {
        'street': '123 Main Street',
        'city': 'Phnom Penh',
        'state': '',
        'postalCode': '12000',
        'country': 'Cambodia',
      },
    };

    final success = await ref.read(ordersProvider.notifier).createOrder(
      items: items,
      delivery: delivery,
    );

    if (!mounted) return;
    setState(() => _isPlacingOrder = false);

    if (success) {
      await ref.read(cartProvider.notifier).clearCart();
      if (mounted) _showSuccessDialog();
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 78,
                height: 78,
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle,
                    color: AppColors.success, size: 48),
              ),
              const SizedBox(height: 24),
              Text('Congratulations!',
                  style: AppTextStyles.h2SemiBold.copyWith(fontSize: 22)),
              const SizedBox(height: 8),
              Text('Your order has been placed.',
                  style: AppTextStyles.b2Regular
                      .copyWith(color: AppColors.primary500)),
              const SizedBox(height: 24),
              AppButton(
                label: 'Track My Order',
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.pushReplacementNamed(context, AppRoutes.orders);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider).cart;

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
                      child: Text('Checkout',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),

                    // 1. Delivery Address
                    Text('Delivery Address',
                        style: AppTextStyles.b1Medium
                            .copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.primary100),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.location_on_outlined,
                              size: 24, color: AppColors.primary500),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              '123 Main Street, Phnom Penh, 12000',
                              style: AppTextStyles.b2Regular,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          GestureDetector(
                            onTap: () {},
                            child: Text('Change',
                                style: AppTextStyles.b2Regular.copyWith(
                                    color: AppColors.primary900,
                                    fontWeight: FontWeight.w600)),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // 2. Payment Method
                    Text('Payment Method',
                        style: AppTextStyles.b1Medium
                            .copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _PaymentChip(
                          label: 'Card',
                          isActive: _selectedPayment == 0,
                          onTap: () => setState(() => _selectedPayment = 0),
                        ),
                        const SizedBox(width: 12),
                        _PaymentChip(
                          label: 'Cash',
                          isActive: _selectedPayment == 1,
                          onTap: () => setState(() => _selectedPayment = 1),
                        ),
                      ],
                    ),

                    if (_selectedPayment == 0) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primary100),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.credit_card, size: 24),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text('**** **** **** 2512',
                                  style: AppTextStyles.b1Regular),
                            ),
                            const Icon(Icons.edit_outlined,
                                size: 18, color: AppColors.primary400),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 24),

                    // 3. Order Summary
                    Text('Order Summary',
                        style: AppTextStyles.b1Medium
                            .copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    _OrderSummaryRow(
                        label: 'Sub-total', value: cart.subtotal),
                    const SizedBox(height: 8),
                    _OrderSummaryRow(label: 'VAT (%)', value: cart.vat),
                    const SizedBox(height: 8),
                    _OrderSummaryRow(
                        label: 'Shipping fee', value: cart.shippingFee),
                    const Divider(height: 24, color: AppColors.primary100),
                    _OrderSummaryRow(
                        label: 'Total', value: cart.total, isBold: true),

                    const SizedBox(height: 24),

                    // 4. Promo Code
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _promoController,
                            decoration: InputDecoration(
                              hintText: 'Promo code',
                              hintStyle: AppTextStyles.b2Regular
                                  .copyWith(color: AppColors.primary400),
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 14),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide:
                                    const BorderSide(color: AppColors.primary100),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide:
                                    const BorderSide(color: AppColors.primary100),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        SizedBox(
                          width: 80,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary900,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 0,
                            ),
                            child: Text('Apply',
                                style: AppTextStyles.b2Regular.copyWith(
                                    color: AppColors.primary0,
                                    fontWeight: FontWeight.w500)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Place order button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: AppButton(
                label: 'Place Order',
                isLoading: _isPlacingOrder,
                onPressed: _placeOrder,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentChip extends StatelessWidget {
  const _PaymentChip({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  final String label;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? AppColors.primary900 : AppColors.primary0,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? AppColors.primary900 : AppColors.primary100,
          ),
        ),
        child: Text(
          label,
          style: AppTextStyles.b2Regular.copyWith(
            color: isActive ? AppColors.primary0 : AppColors.primary900,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

class _OrderSummaryRow extends StatelessWidget {
  const _OrderSummaryRow({
    required this.label,
    required this.value,
    this.isBold = false,
  });

  final String label;
  final double value;
  final bool isBold;

  @override
  Widget build(BuildContext context) {
    final style = isBold
        ? AppTextStyles.b1Medium
        : AppTextStyles.b1Regular.copyWith(color: AppColors.primary500);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text('\$ ${value.toStringAsFixed(2)}', style: style),
      ],
    );
  }
}
