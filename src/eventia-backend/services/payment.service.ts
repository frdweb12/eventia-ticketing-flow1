
import { supabase } from '@/integrations/supabase/client';
import { Payment, UpiSettings } from '../models';

export const paymentService = {
  /**
   * Create a new payment record
   */
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('booking_payments')
      .insert([payment])
      .select();
      
    if (error) throw error;
    return data[0] as Payment;
  },
  
  /**
   * Update UTR number for a payment
   */
  async updateUtrNumber(id: string, utrNumber: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .update({ utr_number: utrNumber })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Payment;
  },
  
  /**
   * Verify a payment
   */
  async verifyPayment(id: string, adminId: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .update({ 
        status: 'verified', 
        verified_by: adminId,
        payment_date: new Date().toISOString()
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Payment;
  },
  
  /**
   * Reject a payment
   */
  async rejectPayment(id: string, adminId: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .update({ 
        status: 'rejected', 
        verified_by: adminId
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Payment;
  },
  
  /**
   * Get payment by booking ID
   */
  async getPaymentByBookingId(bookingId: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
      
    if (error) throw error;
    return data as Payment;
  },
  
  /**
   * Get UPI settings
   */
  async getUpiSettings() {
    const { data, error } = await supabase
      .from('upi_settings')
      .select('*')
      .eq('isActive', true)
      .single();
      
    if (error) return null;
    return data as UpiSettings;
  },
  
  /**
   * Update UPI settings
   */
  async updateUpiSettings(settings: Partial<UpiSettings>) {
    const { data, error } = await supabase
      .from('upi_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)
      .select();
      
    if (error) throw error;
    return data[0] as UpiSettings;
  }
};
