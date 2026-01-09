"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseMapper = void 0;
class PaymentResponseMapper {
    static toResponse(payment) {
        return {
            id: payment._id.toString(),
            orderId: payment.orderId.toString(),
            amount: payment.amount,
            currency: payment.currency,
            method: payment.method,
            status: payment.status,
            khqrString: payment.khqrString,
            transactionRef: payment.transactionRef,
            paidAt: payment.paidAt,
            expiresAt: payment.expiresAt,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
}
exports.PaymentResponseMapper = PaymentResponseMapper;
