import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/app/theme/app_colors.dart';
import 'package:mobile/app/theme/app_text_styles.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/cart_provider.dart';
import 'package:mobile/providers/product_provider.dart';
import 'package:mobile/providers/wishlist_provider.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  const ProductDetailScreen({super.key, required this.productId});

  final String productId;

  @override
  ConsumerState<ProductDetailScreen> createState() =>
      _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  String? _selectedSize;
  String? _selectedColor;
  int _quantity = 1;
  int _currentImageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final productAsync = ref.watch(productDetailProvider(widget.productId));
    final wishlistState = ref.watch(wishlistProvider);

    return Scaffold(
      backgroundColor: AppColors.primary0,
      body: productAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
        data: (product) {
          if (product == null) {
            return const Center(child: Text('Product not found'));
          }
          final isSaved = wishlistState.containsProduct(product.id);
          return _buildContent(product, isSaved);
        },
      ),
    );
  }

  Widget _buildContent(Product product, bool isSaved) {
    final selectedVariant = _getSelectedVariant(product);
    final price = selectedVariant?.price ?? product.minPrice;

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image carousel
                _buildImageCarousel(product, isSaved),

                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product name
                      Text(
                        product.name,
                        style: AppTextStyles.h2SemiBold.copyWith(fontSize: 20),
                      ),
                      const SizedBox(height: 8),

                      // Rating
                      Row(
                        children: [
                          ...List.generate(
                            5,
                            (i) => Icon(
                              i < product.rating.round()
                                  ? Icons.star
                                  : Icons.star_border,
                              size: 18,
                              color: Colors.amber,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '(${product.reviewCount} reviews)',
                            style: AppTextStyles.b2Regular,
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Price
                      Text(
                        '\$ ${price.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.w600,
                          fontSize: 22,
                          color: AppColors.primary900,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Size selector
                      if (product.availableSizes.isNotEmpty) ...[
                        Text('Size', style: AppTextStyles.b1Medium),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          children: product.availableSizes.map((size) {
                            final isSelected = _selectedSize == size;
                            return GestureDetector(
                              onTap: () =>
                                  setState(() => _selectedSize = size),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.primary900
                                      : AppColors.primary0,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.primary900
                                        : AppColors.primary100,
                                  ),
                                ),
                                child: Text(
                                  size,
                                  style: TextStyle(
                                    fontFamily: 'Poppins',
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                    color: isSelected
                                        ? AppColors.primary0
                                        : AppColors.primary900,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Color selector
                      if (product.availableColors.isNotEmpty) ...[
                        Text('Color', style: AppTextStyles.b1Medium),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          children: product.availableColors.map((color) {
                            final isSelected = _selectedColor == color;
                            return GestureDetector(
                              onTap: () =>
                                  setState(() => _selectedColor = color),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.primary900
                                      : AppColors.primary0,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.primary900
                                        : AppColors.primary100,
                                  ),
                                ),
                                child: Text(
                                  color,
                                  style: TextStyle(
                                    fontFamily: 'Poppins',
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                    color: isSelected
                                        ? AppColors.primary0
                                        : AppColors.primary900,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Description
                      Text('Description', style: AppTextStyles.b1Medium),
                      const SizedBox(height: 8),
                      Text(
                        product.description,
                        style: AppTextStyles.b2Regular.copyWith(height: 1.6),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom bar
        _buildBottomBar(product, price),
      ],
    );
  }

  Widget _buildImageCarousel(Product product, bool isSaved) {
    final images = product.images;
    return SizedBox(
      height: 390,
      child: Stack(
        children: [
          if (images.isNotEmpty)
            PageView.builder(
              itemCount: images.length,
              onPageChanged: (i) =>
                  setState(() => _currentImageIndex = i),
              itemBuilder: (_, i) => Image.network(
                images[i],
                fit: BoxFit.cover,
                width: double.infinity,
                errorBuilder: (_, __, ___) => Container(
                  color: AppColors.primary100.withValues(alpha: 0.3),
                  child: const Center(
                    child: Icon(Icons.image_outlined,
                        size: 60, color: AppColors.primary200),
                  ),
                ),
              ),
            )
          else
            Container(
              color: AppColors.primary100.withValues(alpha: 0.3),
              child: const Center(
                child: Icon(Icons.image_outlined,
                    size: 60, color: AppColors.primary200),
              ),
            ),

          // Back arrow + bell
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            left: 24,
            right: 24,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary0.withValues(alpha: 0.8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.arrow_back, size: 22),
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pushNamed(
                      context, AppRoutes.notifications),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary0.withValues(alpha: 0.8),
                      shape: BoxShape.circle,
                    ),
                    child:
                        const Icon(Icons.notifications_none, size: 22),
                  ),
                ),
              ],
            ),
          ),

          // Heart
          Positioned(
            top: MediaQuery.of(context).padding.top + 60,
            right: 24,
            child: GestureDetector(
              onTap: () => ref
                  .read(wishlistProvider.notifier)
                  .toggleWishlist(product),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary0.withValues(alpha: 0.8),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isSaved ? Icons.favorite : Icons.favorite_outline,
                  size: 22,
                  color: isSaved ? Colors.red : AppColors.primary900,
                ),
              ),
            ),
          ),

          // Dots indicator
          if (images.length > 1)
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  images.length,
                  (i) => Container(
                    width: i == _currentImageIndex ? 24 : 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      color: i == _currentImageIndex
                          ? AppColors.primary900
                          : AppColors.primary200,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(Product product, double price) {
    final cartState = ref.watch(cartProvider);
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
      decoration: BoxDecoration(
        color: AppColors.primary0,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            // Quantity control
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.primary100),
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: _quantity > 1
                        ? () => setState(() => _quantity--)
                        : null,
                    icon: const Icon(Icons.remove, size: 18),
                    constraints:
                        const BoxConstraints(minWidth: 36, minHeight: 36),
                  ),
                  Text('$_quantity',
                      style: AppTextStyles.b1Medium.copyWith(fontSize: 16)),
                  IconButton(
                    onPressed: () => setState(() => _quantity++),
                    icon: const Icon(Icons.add, size: 18),
                    constraints:
                        const BoxConstraints(minWidth: 36, minHeight: 36),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            // Add to cart button
            Expanded(
              child: SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: cartState.isLoading
                      ? null
                      : () => _addToCart(product, price),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary900,
                    foregroundColor: AppColors.primary0,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: cartState.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: AppColors.primary0),
                        )
                      : Text(
                          'Add to Cart',
                          style: AppTextStyles.b1Medium.copyWith(
                              color: AppColors.primary0),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  ProductVariant? _getSelectedVariant(Product product) {
    if (product.variants.isEmpty) return null;
    return product.variants.firstWhere(
      (v) =>
          (_selectedSize == null || v.size == _selectedSize) &&
          (_selectedColor == null || v.color == _selectedColor),
      orElse: () => product.variants.first,
    );
  }

  Future<void> _addToCart(Product product, double price) async {
    final variant = _getSelectedVariant(product);
    if (variant == null) return;

    final success = await ref.read(cartProvider.notifier).addToCart(
          productId: product.id,
          variantId: variant.variantId,
          size: variant.size,
          color: variant.color,
          price: price,
          quantity: _quantity,
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(success ? 'Added to cart!' : 'Failed to add to cart'),
        backgroundColor: success ? AppColors.success : AppColors.error,
      ),
    );
  }
}
