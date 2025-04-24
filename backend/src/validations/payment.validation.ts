
import { z } from 'zod';
import { paymentSchema, upiSettingsSchema } from '../models/payment';

export const createPaymentSchema = z.object({
  body: paymentSchema,
  params: z.object({}),
  query: z.object({})
});

export const updateUtrSchema = z.object({
  body: z.object({
    utrNumber: z.string().min(1, 'UTR number is required')
  }),
  params: z.object({
    id: z.string().min(1, 'Payment ID is required')
  }),
  query: z.object({})
});

export const getPaymentSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().min(1, 'Payment ID is required')
  }),
  query: z.object({})
});

export const getPaymentByBookingIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    bookingId: z.string().min(1, 'Booking ID is required')
  }),
  query: z.object({})
});

export const getAllPaymentsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['pending', 'verified', 'rejected', 'refunded']).optional()
  })
});

export const verifyPaymentSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().min(1, 'Payment ID is required')
  }),
  query: z.object({})
});

export const rejectPaymentSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().min(1, 'Payment ID is required')
  }),
  query: z.object({})
});

export const upiSettingsSchema = z.object({
  body: upiSettingsSchema,
  params: z.object({}),
  query: z.object({})
});

export const updateUpiSettingsSchema = z.object({
  body: upiSettingsSchema,
  params: z.object({
    id: z.string().min(1, 'Settings ID is required')
  }),
  query: z.object({})
});
