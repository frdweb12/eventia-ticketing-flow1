
import axios from 'axios';
import { API_BASE_URL } from '@/config';

// Define interfaces for our API responses and requests
export interface UpiSettings {
  upiVPA: string;
  discountAmount: number;
  isActive?: boolean;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentCreateRequest {
  booking_id: string;
  amount: number;
  utr_number?: string;
}

export interface PaymentResponse {
  id: string;
  booking_id: string;
  amount: number;
  utr_number?: string;
  payment_date?: string;
  status: 'pending' | 'verified' | 'rejected' | 'refunded';
  verified_by?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Create axios instance with default config
const paymentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Payment API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Create a new payment
 */
export const createPayment = async (data: PaymentCreateRequest): Promise<ApiResponse<PaymentResponse>> => {
  const response = await paymentApi.post('/', data);
  return response.data;
};

/**
 * Update UTR number for an existing payment
 */
export const updateUtrNumber = async (id: string, utrNumber: string): Promise<ApiResponse<PaymentResponse>> => {
  const response = await paymentApi.put(`/${id}/utr`, { utrNumber });
  return response.data;
};

/**
 * Get active UPI settings
 */
export const getUpiSettings = async (): Promise<ApiResponse<UpiSettings>> => {
  const response = await paymentApi.get('/upi-settings');
  return response.data;
};

/**
 * Get payment status by booking ID
 */
export const getPaymentByBookingId = async (bookingId: string): Promise<ApiResponse<PaymentResponse | null>> => {
  const response = await paymentApi.get(`/booking/${bookingId}`);
  return response.data;
};

/**
 * Verify a payment (admin only)
 */
export const verifyPayment = async (id: string): Promise<ApiResponse<PaymentResponse>> => {
  const response = await paymentApi.put(`/${id}/verify`);
  return response.data;
};

/**
 * Reject a payment (admin only)
 */
export const rejectPayment = async (id: string): Promise<ApiResponse<PaymentResponse>> => {
  const response = await paymentApi.put(`/${id}/reject`);
  return response.data;
};
