class OrderItem {
  const OrderItem({
    required this.productId,
    required this.variantId,
    required this.productName,
    required this.size,
    required this.color,
    required this.price,
    required this.quantity,
    this.image,
  });

  final String productId;
  final String variantId;
  final String productName;
  final String size;
  final String color;
  final double price;
  final int quantity;
  final String? image;

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      productId: json['productId']?.toString() ?? '',
      variantId: json['variantId']?.toString() ?? '',
      productName: json['productName']?.toString() ?? '',
      size: json['size']?.toString() ?? '',
      color: json['color']?.toString() ?? '',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0.0,
      quantity:
          (json['quantity'] is num) ? (json['quantity'] as num).toInt() : 1,
      image: json['image']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'productId': productId,
    'variantId': variantId,
    'productName': productName,
    'size': size,
    'color': color,
    'price': price,
    'quantity': quantity,
  };
}

class OrderDelivery {
  const OrderDelivery({
    this.courier = '',
    this.street = '',
    this.city = '',
    this.state = '',
    this.postalCode = '',
    this.country = '',
  });

  final String courier;
  final String street;
  final String city;
  final String state;
  final String postalCode;
  final String country;

  String get fullAddress => [street, city, state, postalCode, country]
      .where((s) => s.isNotEmpty)
      .join(', ');

  factory OrderDelivery.fromJson(Map<String, dynamic> json) {
    final address =
        json['address'] is Map<String, dynamic> ? json['address'] : json;
    return OrderDelivery(
      courier: json['courier']?.toString() ?? '',
      street: (address['street'] ?? '').toString(),
      city: (address['city'] ?? '').toString(),
      state: (address['state'] ?? '').toString(),
      postalCode: (address['postalCode'] ?? '').toString(),
      country: (address['country'] ?? '').toString(),
    );
  }
}

enum OrderStatus {
  pending,
  processing,
  shipped,
  delivered,
  cancelled;

  static OrderStatus fromString(String value) {
    switch (value.toLowerCase()) {
      case 'processing':
        return OrderStatus.processing;
      case 'shipped':
        return OrderStatus.shipped;
      case 'delivered':
        return OrderStatus.delivered;
      case 'cancelled':
        return OrderStatus.cancelled;
      default:
        return OrderStatus.pending;
    }
  }

  String get label {
    switch (this) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Ongoing';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  bool get isOngoing =>
      this == OrderStatus.pending ||
      this == OrderStatus.processing ||
      this == OrderStatus.shipped;

  bool get isCompleted =>
      this == OrderStatus.delivered || this == OrderStatus.cancelled;
}

class Order {
  const Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.status,
    required this.delivery,
    this.totalAmount = 0,
    this.createdAt,
  });

  final String id;
  final String userId;
  final List<OrderItem> items;
  final OrderStatus status;
  final OrderDelivery delivery;
  final double totalAmount;
  final DateTime? createdAt;

  factory Order.fromJson(Map<String, dynamic> json) {
    final itemsList = <OrderItem>[];
    final rawItems = json['item'] ?? json['items'];
    if (rawItems is List) {
      for (final item in rawItems) {
        if (item is Map<String, dynamic>) {
          itemsList.add(OrderItem.fromJson(item));
        }
      }
    }

    return Order(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      items: itemsList,
      status: OrderStatus.fromString(json['status']?.toString() ?? 'pending'),
      delivery: json['delivery'] is Map<String, dynamic>
          ? OrderDelivery.fromJson(json['delivery'] as Map<String, dynamic>)
          : const OrderDelivery(),
      totalAmount: (json['totalAmount'] is num)
          ? (json['totalAmount'] as num).toDouble()
          : 0.0,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }
}
