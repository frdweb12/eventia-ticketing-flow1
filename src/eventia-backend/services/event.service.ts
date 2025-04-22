
import { supabase } from '@/integrations/supabase/client';
import { Event } from '../models';

export const eventService = {
  /**
   * Get all events
   */
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Event[];
  },
  
  /**
   * Get featured events
   */
  async getFeaturedEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('start_date', { ascending: true });
      
    if (error) throw error;
    return data as Event[];
  },
  
  /**
   * Get event by ID
   */
  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Event;
  },
  
  /**
   * Create a new event
   */
  async createEvent(event: Omit<Event, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
      
    if (error) throw error;
    return data[0] as Event;
  },
  
  /**
   * Update an event
   */
  async updateEvent(id: string, event: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Event;
  },
  
  /**
   * Delete an event
   */
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
