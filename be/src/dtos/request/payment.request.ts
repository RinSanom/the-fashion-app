export interface CreatePaymentDTO {
  orderId: string;
  method: "BAKONG";
  amount: number;
  currency: "KHR" | "USD";
  expiesAt?: Date;
}

export interface UpdatePaymentStatusDTO {
  status: "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";
  transactionRef?: string;
  paidAt?: Date;
}

export interface PaymentResponseDTO {
  id: string;
  orderId: string;
  method: "BAKONG";
  amount: number;
  currency: "KHR" | "USD";
  khqrString?: string;
  md5Hash?: string;
  transactionRef?: string;
  status: "CREATED" | "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";
  paidAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentFilterDTO {
  status?: "CREATED" | "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";
  method?: "BAKONG";
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface GenerateKHQRDTO {
  amount: number;
  currency: "KHR" | "USD";
  orderId: string;
}

export interface VerifyPaymentDTO {
  khqrString: string;
  transactionRef: string;
  orderId: string;
}
