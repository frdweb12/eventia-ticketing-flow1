
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  utr_number?: string;
  payment_date?: string;
  status: 'pending' | 'verified' | 'rejected' | 'refunded';
  verified_by?: string; // Admin ID who verified the payment
  created_at: string;
}

export interface UpiSettings {
  id: string;
  upiVPA: string;
  discountAmount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}
