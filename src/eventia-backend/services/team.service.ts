
import { supabase } from '@/integrations/supabase/client';
import { Team } from '../models';

export const teamService = {
  /**
   * Get all teams
   */
  async getAllTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data as Team[];
  },
  
  /**
   * Get team by ID
   */
  async getTeamById(id: string) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Team;
  },
  
  /**
   * Create a new team
   */
  async createTeam(team: Omit<Team, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('teams')
      .insert([team])
      .select();
      
    if (error) throw error;
    return data[0] as Team;
  },
  
  /**
   * Update a team
   */
  async updateTeam(id: string, team: Partial<Team>) {
    const { data, error } = await supabase
      .from('teams')
      .update(team)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Team;
  }
};
