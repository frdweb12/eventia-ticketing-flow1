
import { supabase } from '@/integrations/supabase/client';
import { Stadium, Seat } from '../models';

export const stadiumService = {
  /**
   * Get all stadiums
   */
  async getAllStadiums() {
    const { data, error } = await supabase
      .from('stadiums')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data as Stadium[];
  },
  
  /**
   * Get stadium by ID
   */
  async getStadiumById(id: string) {
    const { data, error } = await supabase
      .from('stadiums')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Stadium;
  },
  
  /**
   * Create a new stadium
   */
  async createStadium(stadium: Omit<Stadium, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('stadiums')
      .insert([stadium])
      .select();
      
    if (error) throw error;
    return data[0] as Stadium;
  },
  
  /**
   * Update a stadium
   */
  async updateStadium(id: string, stadium: Partial<Stadium>) {
    const { data, error } = await supabase
      .from('stadiums')
      .update(stadium)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Stadium;
  },
  
  /**
   * Get seats by stadium ID
   */
  async getSeatsByStadiumId(stadiumId: string) {
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('stadium_id', stadiumId)
      .order('section', { ascending: true })
      .order('row', { ascending: true })
      .order('number', { ascending: true });
      
    if (error) throw error;
    return data as Seat[];
  },
  
  /**
   * Lock seats (mark as unavailable)
   */
  async lockSeats(seatIds: string[]) {
    const { data, error } = await supabase
      .from('seats')
      .update({ is_available: false })
      .in('id', seatIds)
      .select();
      
    if (error) throw error;
    return data as Seat[];
  },
  
  /**
   * Unlock seats (mark as available)
   */
  async unlockSeats(seatIds: string[]) {
    const { data, error } = await supabase
      .from('seats')
      .update({ is_available: true })
      .in('id', seatIds)
      .select();
      
    if (error) throw error;
    return data as Seat[];
  }
};
