
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export const paymentService = {
  /**
   * Create a new payment record
   */
  async createPayment(payment: Omit<Database['public']['Tables']['booking_payments']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('booking_payments')
      .insert([{ ...payment }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update UTR number for a payment
   */
  async updateUtrNumber(id: string, utrNumber: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .update({ utr_number: utrNumber })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
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
      .select()
      .single();
    if (error) throw error;
    return data;
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
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Get payment by booking ID
   */
  async getPaymentByBookingId(bookingId: string) {
    const { data, error } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Get UPI settings
   */
  async getUpiSettings() {
    const { data, error } = await supabase
      .from('upi_settings')
      .select('*')
      .eq('isActive', true)
      .maybeSingle();
    if (error) return null;
    return data;
  },

  /**
   * Update UPI settings
   */
  async updateUpiSettings(settings: Partial<Database['public']['Tables']['upi_settings']['Update']>) {
    const { data, error } = await supabase
      .from('upi_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
