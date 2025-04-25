
import axios from 'axios';

// Base URL for API calls - adjust as needed for your environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create API instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface UpiSettings {
  id: string;
  upivpa: string;
  discountamount: number;
  isactive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  utr_number?: string;
  status: string;
  created_at: string;
  payment_date?: string;
}

// API Methods
export const getUpiSettings = () => {
  return api.get('/payments/upi-settings');
};

export const createPayment = (paymentData: {
  booking_id: string;
  amount: number;
  utr_number: string;
}) => {
  return api.post('/payments', paymentData);
};

export const getPaymentByBookingId = (bookingId: string) => {
  return api.get(`/payments/booking/${bookingId}`);
};

export const verifyPayment = (paymentId: string) => {
  return api.put(`/payments/${paymentId}/verify`);
};

// Fallback methods for when backend is not available
export const getFallbackUpiSettings = (): UpiSettings => {
  return {
    id: 'fallback',
    upivpa: 'eventia@okicici',
    discountamount: 0,
    isactive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Adjust Axios error handling for better debugging
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Log detailed error information
    console.error('API Error:', error?.response?.data || error.message);
    
    // For Supabase fallback
    if (error.message.includes('Network Error') || error.message.includes('timeout')) {
      console.log('Using Supabase fallback due to API being unavailable');
      // You can implement Supabase fallback logic here
    }
    
    return Promise.reject(error);
  }
);

export default api;
