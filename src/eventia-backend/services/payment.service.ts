
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Payment, UpiSettings } from '../models/payment.model';

export const paymentService = {
  /**
   * Create a new payment record
   */
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('booking_payments')
      .insert([payment])
      .select()
      .single();
    if (error) throw error;
    return data as Payment;
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
    return data as Payment;
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
    return data as Payment;
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
    return data as Payment;
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
    return data as Payment | null;
  },

  /**
   * Get UPI settings
   */
  async getUpiSettings() {
    const { data, error } = await supabase
      .from('upi_settings')
      .select('*')
      .eq('isactive', true)
      .maybeSingle();
    if (error) return null;
    
    // Type cast to match the UpiSettings interface
    return data ? {
      id: data.id,
      upiVPA: data.upivpa,
      discountAmount: data.discountamount,
      isActive: data.isactive,
      created_at: data.created_at,
      updated_at: data.updated_at
    } : null;
  },

  /**
   * Update UPI settings
   */
  async updateUpiSettings(settings: Partial<UpiSettings>) {
    const { data, error } = await supabase
      .from('upi_settings')
      .update({
        upivpa: settings.upiVPA,
        discountamount: settings.discountAmount,
        isactive: settings.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)
      .select()
      .single();
    if (error) throw error;
    
    // Type cast to match the UpiSettings interface
    return data ? {
      id: data.id,
      upiVPA: data.upivpa,
      discountAmount: data.discountamount,
      isActive: data.isactive,
      created_at: data.created_at,
      updated_at: data.updated_at
    } : null as never;
  }
};
