import 'package:flutter/material.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/models/order.dart';

class TrackOrderScreen extends StatelessWidget {
  const TrackOrderScreen({super.key, required this.order});

  final Order order;

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
                      child: Text('Track Order',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Map placeholder
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                color: AppColors.primary100.withValues(alpha: 0.3),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Icon(Icons.map_outlined,
                        size: 80, color: AppColors.primary200),
                    // Origin
                    Positioned(
                      left: 60,
                      top: 80,
                      child: _MapPin(
                        icon: Icons.warehouse_outlined,
                        color: AppColors.primary900,
                      ),
                    ),
                    // Truck
                    Positioned(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: AppColors.primary900,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.local_shipping,
                            color: AppColors.primary0, size: 24),
                      ),
                    ),
                    // Destination
                    Positioned(
                      right: 60,
                      bottom: 80,
                      child: _MapPin(
                        icon: Icons.location_on,
                        color: AppColors.error,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom sheet
            Expanded(
              flex: 4,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  color: AppColors.primary0,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, -2),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: AppColors.primary200,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text('Order Status',
                          style: AppTextStyles.b1Medium.copyWith(fontSize: 18)),
                      const SizedBox(height: 20),

                      // Steps
                      _StatusStep(
                        title: 'Order Placed',
                        subtitle: 'Your order has been placed',
                        isCompleted: true,
                        isLast: false,
                      ),
                      _StatusStep(
                        title: 'Packing',
                        subtitle: order.delivery.fullAddress.isNotEmpty
                            ? order.delivery.fullAddress
                            : 'Preparing your items',
                        isCompleted: _isStepCompleted(OrderStatus.processing),
                        isLast: false,
                      ),
                      _StatusStep(
                        title: 'In Transit',
                        subtitle: 'Your order is on the way',
                        isCompleted: _isStepCompleted(OrderStatus.shipped),
                        isLast: false,
                      ),
                      _StatusStep(
                        title: 'Delivered',
                        subtitle: 'Your order has been delivered',
                        isCompleted: _isStepCompleted(OrderStatus.delivered),
                        isLast: true,
                      ),

                      const Divider(height: 32, color: AppColors.primary100),

                      // Delivery person
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: AppColors.primary100,
                            child: const Icon(Icons.person,
                                color: AppColors.primary500),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Delivery Person',
                                    style: AppTextStyles.b1Medium
                                        .copyWith(fontSize: 14)),
                                Text(order.delivery.courier.isNotEmpty
                                    ? order.delivery.courier
                                    : 'Standard Delivery',
                                    style: AppTextStyles.b2Regular.copyWith(
                                        color: AppColors.primary500)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.primary900,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.phone,
                                color: AppColors.primary0, size: 20),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  bool _isStepCompleted(OrderStatus step) {
    const progression = [
      OrderStatus.pending,
      OrderStatus.processing,
      OrderStatus.shipped,
      OrderStatus.delivered,
    ];
    final currentIndex = progression.indexOf(order.status);
    final stepIndex = progression.indexOf(step);
    return currentIndex >= stepIndex;
  }
}

class _MapPin extends StatelessWidget {
  const _MapPin({required this.icon, required this.color});

  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 24),
    );
  }
}

class _StatusStep extends StatelessWidget {
  const _StatusStep({
    required this.title,
    required this.subtitle,
    required this.isCompleted,
    required this.isLast,
  });

  final String title;
  final String subtitle;
  final bool isCompleted;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCompleted ? AppColors.primary900 : AppColors.primary0,
                border: Border.all(
                  color:
                      isCompleted ? AppColors.primary900 : AppColors.primary200,
                  width: 2,
                ),
              ),
              child: isCompleted
                  ? const Icon(Icons.check, color: AppColors.primary0, size: 14)
                  : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 48,
                color: isCompleted ? AppColors.primary900 : AppColors.primary200,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: AppTextStyles.b1Medium.copyWith(
                      fontSize: 14,
                      color: isCompleted
                          ? AppColors.primary900
                          : AppColors.primary400,
                    )),
                Text(subtitle,
                    style: AppTextStyles.b2Regular.copyWith(
                      color: AppColors.primary500,
                      fontSize: 12,
                    )),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
