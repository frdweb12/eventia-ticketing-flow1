
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export const eventService = {
  /**
   * Get all events
   */
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  },

  /**
   * Get featured events
   */
  async getFeaturedEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  },

  /**
   * Get event by ID
   */
  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Create a new event
   */
  async createEvent(event: Omit<Database['public']['Tables']['events']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
