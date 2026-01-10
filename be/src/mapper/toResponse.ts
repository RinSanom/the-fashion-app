import { PaymentResponseDTO } from "@dtos/request/payment.request";
import { IPayment } from "@models/payment";

export  class PaymentResponseMapper {
    static toResponse(payment: IPayment): PaymentResponseDTO { 
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