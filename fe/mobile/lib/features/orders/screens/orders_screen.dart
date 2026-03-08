import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/models/order.dart';
import 'package:mobile/providers/order_provider.dart';
import 'package:mobile/widgets/app_button.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  int _tabIndex = 0; // 0=Ongoing, 1=Completed

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(ordersProvider.notifier).loadOrders());
  }

  @override
  Widget build(BuildContext context) {
    final ordersState = ref.watch(ordersProvider);
    final ongoing = ordersState.ongoing;
    final completed = ordersState.completed;

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
                      child: Text('My Orders',
                          style:
                              AppTextStyles.h2SemiBold.copyWith(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: AppColors.primary100),

            // Toggle tabs
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
              child: Container(
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primary100.withValues(alpha: 0.4),
                  borderRadius: BorderRadius.circular(22),
                ),
                child: Row(
                  children: [
                    _TabButton(
                      label: 'Ongoing',
                      isActive: _tabIndex == 0,
                      onTap: () => setState(() => _tabIndex = 0),
                    ),
                    _TabButton(
                      label: 'Completed',
                      isActive: _tabIndex == 1,
                      onTap: () => setState(() => _tabIndex = 1),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Content
            Expanded(
              child: ordersState.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _tabIndex == 0
                      ? _buildOrdersList(ongoing, isOngoing: true)
                      : _buildOrdersList(completed, isOngoing: false),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrdersList(List<Order> orders, {required bool isOngoing}) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.inventory_2_outlined,
                size: 64, color: AppColors.primary200),
            const SizedBox(height: 20),
            Text(
              isOngoing ? 'No Ongoing Orders!' : 'No Completed Orders!',
              style: AppTextStyles.b1Medium.copyWith(fontSize: 18),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) =>
          _OrderCard(order: orders[i], isOngoing: isOngoing),
    );
  }
}

class _TabButton extends StatelessWidget {
  const _TabButton({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  final String label;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary900 : Colors.transparent,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Text(
            label,
            style: AppTextStyles.b1Medium.copyWith(
              color: isActive ? AppColors.primary0 : AppColors.primary500,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}

class _OrderCard extends ConsumerWidget {
  const _OrderCard({required this.order, required this.isOngoing});

  final Order order;
  final bool isOngoing;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final firstItem = order.items.isNotEmpty ? order.items.first : null;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary100),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Image
              Container(
                width: 65,
                height: 87,
                decoration: BoxDecoration(
                  color: AppColors.primary100.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: firstItem?.image != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(firstItem!.image!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) =>
                                const Icon(Icons.image_outlined)),
                      )
                    : const Icon(Icons.image_outlined,
                        color: AppColors.primary200),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(firstItem?.productName ?? 'Order',
                        style:
                            AppTextStyles.b1Medium.copyWith(fontSize: 14),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis),
                    if (firstItem != null)
                      Text('Size ${firstItem.size}',
                          style: AppTextStyles.b2Regular
                              .copyWith(fontSize: 13)),
                    const SizedBox(height: 4),
                    // Status badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _statusColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        order.status.label,
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: _statusColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('\$ ${order.totalAmount.toStringAsFixed(2)}',
                      style: AppTextStyles.b1Medium.copyWith(fontSize: 14)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Action button
          if (isOngoing)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => Navigator.pushNamed(
                  context,
                  AppRoutes.trackOrder,
                  arguments: order,
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.primary900),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
                child: Text('Track Order',
                    style: AppTextStyles.b2Regular.copyWith(
                        color: AppColors.primary900,
                        fontWeight: FontWeight.w500)),
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => _showReviewSheet(context),
                icon: const Icon(Icons.star, size: 16, color: Colors.amber),
                label: Text('Leave a Review',
                    style: AppTextStyles.b2Regular.copyWith(
                        color: AppColors.primary900,
                        fontWeight: FontWeight.w500)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.primary900),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Color get _statusColor {
    switch (order.status) {
      case OrderStatus.delivered:
        return AppColors.success;
      case OrderStatus.cancelled:
        return AppColors.error;
      default:
        return Colors.amber.shade700;
    }
  }

  void _showReviewSheet(BuildContext context) {
    int selectedRating = 0;
    final commentController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Leave a Review',
                      style: AppTextStyles.b1Medium.copyWith(fontSize: 18)),
                  GestureDetector(
                    onTap: () => Navigator.pop(ctx),
                    child: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text('How was your order?',
                  style: AppTextStyles.b2Regular
                      .copyWith(color: AppColors.primary500)),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  5,
                  (i) => GestureDetector(
                    onTap: () => setSheetState(() => selectedRating = i + 1),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Icon(
                        i < selectedRating ? Icons.star : Icons.star_border,
                        color: Colors.amber,
                        size: 36,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: commentController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'Write your review...',
                  hintStyle: AppTextStyles.b2Regular
                      .copyWith(color: AppColors.primary400),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.primary100),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.primary100),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              AppButton(
                label: 'Submit Review',
                onPressed: selectedRating > 0
                    ? () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Review submitted!'),
                            backgroundColor: AppColors.success,
                          ),
                        );
                      }
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
