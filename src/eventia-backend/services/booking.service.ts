
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Booking, DeliveryDetails } from '../models';

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type DeliveryDetailsRow = Database['public']['Tables']['delivery_details']['Row'];
type DeliveryDetailsInsert = Database['public']['Tables']['delivery_details']['Insert'];

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(booking: Omit<BookingInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
      
    if (error) throw error;
    return data as Booking;
  },
  
  /**
   * Get booking by ID
   */
  async getBookingById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Booking;
  },
  
  /**
   * Get bookings by user ID
   */
  async getBookingsByUserId(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Booking[];
  },
  
  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Booking;
  },
  
  /**
   * Add delivery details to a booking
   */
  async addDeliveryDetails(deliveryDetails: Omit<DeliveryDetailsInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('delivery_details')
      .insert([deliveryDetails])
      .select()
      .single();
      
    if (error) throw error;
    return data as DeliveryDetails;
  },
  
  /**
   * Get delivery details by booking ID
   */
  async getDeliveryDetailsByBookingId(bookingId: string) {
    const { data, error } = await supabase
      .from('delivery_details')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
      
    if (error) throw error;
    return data as DeliveryDetails;
  }
};
