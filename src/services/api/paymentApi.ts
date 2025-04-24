
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const paymentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPayment = async (data: {
  booking_id: string;
  amount: number;
  utr_number?: string;
}) => {
  const response = await paymentApi.post('/', data);
  return response.data;
};

export const updateUtrNumber = async (id: string, utrNumber: string) => {
  const response = await paymentApi.put(`/${id}/utr`, { utrNumber });
  return response.data;
};

export const getUpiSettings = async () => {
  const response = await paymentApi.get('/upi-settings');
  return response.data;
};
