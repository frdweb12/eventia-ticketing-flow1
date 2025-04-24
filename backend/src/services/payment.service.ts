
import { PaymentModel, UpiSettingsModel, Payment, UpiSettings, PaymentCreateInput, UpiSettingsInput, PaymentStatus } from '../models/payment';
import { BookingModel } from '../models/booking';
import { ApiError } from '../utils/apiError';

export class PaymentService {
  /**
   * Create a new payment record
   */
  static async createPayment(data: PaymentCreateInput): Promise<Payment> {
    // Check if booking exists
    const booking = await BookingModel.getById(data.booking_id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
    }
    
    // Check if payment already exists for this booking
    const existingPayment = await PaymentModel.getByBookingId(data.booking_id);
    if (existingPayment) {
      throw new ApiError(400, 'Payment already exists for this booking', 'PAYMENT_EXISTS');
    }
    
    return PaymentModel.create(data);
  }

  /**
   * Update UTR number for a payment
   */
  static async updateUtrNumber(id: string, utrNumber: string): Promise<Payment> {
    const payment = await PaymentModel.getById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    }
    
    return PaymentModel.updateUtrNumber(id, utrNumber);
  }

  /**
   * Verify a payment
   */
  static async verifyPayment(id: string, adminId: string): Promise<Payment> {
    const payment = await PaymentModel.getById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    }
    
    if (payment.status !== 'pending') {
      throw new ApiError(400, `Payment already ${payment.status}`, 'INVALID_PAYMENT_STATUS');
    }
    
    const verifiedPayment = await PaymentModel.verifyPayment(id, adminId);
    
    // Update booking status to confirmed
    await BookingModel.updateStatus(payment.booking_id, 'confirmed');
    
    return verifiedPayment;
  }

  /**
   * Reject a payment
   */
  static async rejectPayment(id: string, adminId: string): Promise<Payment> {
    const payment = await PaymentModel.getById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    }
    
    if (payment.status !== 'pending') {
      throw new ApiError(400, `Payment already ${payment.status}`, 'INVALID_PAYMENT_STATUS');
    }
    
    const rejectedPayment = await PaymentModel.rejectPayment(id, adminId);
    
    // Update booking status to cancelled
    await BookingModel.updateStatus(payment.booking_id, 'cancelled');
    
    return rejectedPayment;
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(id: string): Promise<Payment> {
    const payment = await PaymentModel.getById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    }
    return payment;
  }

  /**
   * Get payment by booking ID
   */
  static async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    return PaymentModel.getByBookingId(bookingId);
  }

  /**
   * Get all payments with pagination and optional status filter
   */
  static async getAllPayments(
    page: number = 1, 
    limit: number = 10, 
    status?: PaymentStatus
  ): Promise<{ payments: Payment[]; total: number; pages: number }> {
    const { payments, total } = await PaymentModel.getAll(page, limit, status);
    const pages = Math.ceil(total / limit);
    
    return {
      payments,
      total,
      pages
    };
  }
}

export class UpiSettingsService {
  /**
   * Get active UPI settings
   */
  static async getUpiSettings(): Promise<UpiSettings | null> {
    return UpiSettingsModel.getActive();
  }

  /**
   * Update UPI settings
   */
  static async updateUpiSettings(id: string, data: UpiSettingsInput): Promise<UpiSettings> {
    return UpiSettingsModel.update(id, data);
  }

  /**
   * Create UPI settings
   */
  static async createUpiSettings(data: UpiSettingsInput): Promise<UpiSettings> {
    return UpiSettingsModel.create(data);
  }
}
