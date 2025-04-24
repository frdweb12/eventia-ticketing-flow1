
import { Request, Response, NextFunction } from 'express';
import { PaymentService, UpiSettingsService } from '../services/payment.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { PaymentStatus } from '../models/payment';

export class PaymentController {
  /**
   * Create a new payment
   * @route POST /api/v1/payments
   */
  static async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await PaymentService.createPayment(req.body);
      
      ApiResponse.success(res, 201, 'Payment created successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update UTR number
   * @route PUT /api/v1/payments/:id/utr
   */
  static async updateUtrNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { utrNumber } = req.body;
      
      if (!utrNumber) {
        throw new ApiError(400, 'UTR number is required', 'VALIDATION_ERROR');
      }
      
      const payment = await PaymentService.updateUtrNumber(id, utrNumber);
      
      ApiResponse.success(res, 200, 'UTR number updated successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by ID
   * @route GET /api/v1/payments/:id
   */
  static async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);
      
      ApiResponse.success(res, 200, 'Payment fetched successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by booking ID
   * @route GET /api/v1/payments/booking/:bookingId
   */
  static async getPaymentByBookingId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookingId } = req.params;
      const payment = await PaymentService.getPaymentByBookingId(bookingId);
      
      if (!payment) {
        ApiResponse.success(res, 200, 'No payment found for this booking', null);
        return;
      }
      
      ApiResponse.success(res, 200, 'Payment fetched successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify payment
   * @route PUT /api/v1/payments/:id/verify
   */
  static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      // @ts-expect-error user is attached by auth middleware
      const adminId = req.user.id;
      
      const payment = await PaymentService.verifyPayment(id, adminId);
      
      ApiResponse.success(res, 200, 'Payment verified successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject payment
   * @route PUT /api/v1/payments/:id/reject
   */
  static async rejectPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      // @ts-expect-error user is attached by auth middleware
      const adminId = req.user.id;
      
      const payment = await PaymentService.rejectPayment(id, adminId);
      
      ApiResponse.success(res, 200, 'Payment rejected successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all payments with pagination and filtering
   * @route GET /api/v1/payments
   */
  static async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as PaymentStatus | undefined;
      
      const result = await PaymentService.getAllPayments(page, limit, status);
      
      ApiResponse.success(res, 200, 'Payments fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export class UpiController {
  /**
   * Get active UPI settings
   * @route GET /api/v1/payments/upi-settings
   */
  static async getUpiSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await UpiSettingsService.getUpiSettings();
      
      if (!settings) {
        ApiResponse.success(res, 200, 'No active UPI settings found', null);
        return;
      }
      
      ApiResponse.success(res, 200, 'UPI settings fetched successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update UPI settings
   * @route PUT /api/v1/payments/upi-settings/:id
   */
  static async updateUpiSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const settings = await UpiSettingsService.updateUpiSettings(id, req.body);
      
      ApiResponse.success(res, 200, 'UPI settings updated successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new UPI settings
   * @route POST /api/v1/payments/upi-settings
   */
  static async createUpiSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await UpiSettingsService.createUpiSettings(req.body);
      
      ApiResponse.success(res, 201, 'UPI settings created successfully', settings);
    } catch (error) {
      next(error);
    }
  }
}
