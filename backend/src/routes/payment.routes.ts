
import { Router } from 'express';
import { PaymentController, UpiController } from '../controllers/payment.controller';
import { validate } from '../middleware/validate';
import * as paymentValidation from '../validations/payment.validation';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCreate'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/', 
  auth(), 
  validate(paymentValidation.createPaymentSchema), 
  PaymentController.createPayment
);

/**
 * @swagger
 * /api/v1/payments/{id}/utr:
 *   put:
 *     summary: Update UTR number for payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utrNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: UTR number updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/utr', 
  validate(paymentValidation.updateUtrSchema), 
  PaymentController.updateUtrNumber
);

/**
 * @swagger
 * /api/v1/payments/{id}/verify:
 *   put:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid payment status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/verify', 
  auth('admin'), 
  validate(paymentValidation.verifyPaymentSchema), 
  PaymentController.verifyPayment
);

/**
 * @swagger
 * /api/v1/payments/{id}/reject:
 *   put:
 *     summary: Reject a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment rejected successfully
 *       400:
 *         description: Invalid payment status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/reject', 
  auth('admin'), 
  validate(paymentValidation.rejectPaymentSchema), 
  PaymentController.rejectPayment
);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id', 
  auth(), 
  validate(paymentValidation.getPaymentSchema), 
  PaymentController.getPaymentById
);

/**
 * @swagger
 * /api/v1/payments/booking/{bookingId}:
 *   get:
 *     summary: Get payment by booking ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/booking/:bookingId', 
  auth(), 
  validate(paymentValidation.getPaymentByBookingIdSchema), 
  PaymentController.getPaymentByBookingId
);

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments with pagination and filters
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected, refunded]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: Payments fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get(
  '/', 
  auth('admin'), 
  validate(paymentValidation.getAllPaymentsSchema), 
  PaymentController.getAllPayments
);

// UPI Settings Routes

/**
 * @swagger
 * /api/v1/payments/upi-settings:
 *   get:
 *     summary: Get active UPI settings
 *     tags: [UPI Settings]
 *     responses:
 *       200:
 *         description: UPI settings fetched successfully
 *       500:
 *         description: Server error
 */
router.get('/upi-settings', UpiController.getUpiSettings);

/**
 * @swagger
 * /api/v1/payments/upi-settings:
 *   post:
 *     summary: Create new UPI settings
 *     tags: [UPI Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpiSettingsCreate'
 *     responses:
 *       201:
 *         description: UPI settings created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.post(
  '/upi-settings', 
  auth('admin'), 
  validate(paymentValidation.upiSettingsSchema), 
  UpiController.createUpiSettings
);

/**
 * @swagger
 * /api/v1/payments/upi-settings/{id}:
 *   put:
 *     summary: Update UPI settings
 *     tags: [UPI Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpiSettingsCreate'
 *     responses:
 *       200:
 *         description: UPI settings updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: UPI settings not found
 *       500:
 *         description: Server error
 */
router.put(
  '/upi-settings/:id', 
  auth('admin'), 
  validate(paymentValidation.updateUpiSettingsSchema), 
  UpiController.updateUpiSettings
);

export default router;
