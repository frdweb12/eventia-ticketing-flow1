import { supabase } from '@/integrations/supabase/client';
import { Discount } from '../models/discount.model';

export const discountService = {
  /**
   * Get all active discounts
   */
  async getAllActiveDiscounts() {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  /**
   * Validate a discount code
   */
  async validateDiscountCode(code: string) {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    
    // Check if discount is expired
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      return { 
        valid: false, 
        message: 'Discount code has expired' 
      };
    }
    
    // Check if maximum uses reached
    if (data.uses_count >= data.max_uses) {
      return { 
        valid: false, 
        message: 'Discount code has reached maximum usage limit' 
      };
    }
    
    return { 
      valid: true, 
      discount: data 
    };
  },

  /**
   * Apply a discount code (increment uses_count)
   */
  async applyDiscountCode(id: string) {
    // First get the current uses_count
    const { data: currentData } = await supabase
      .from('discounts')
      .select('uses_count')
      .eq('id', id)
      .single();
    
    if (!currentData) {
      throw new Error('Discount not found');
    }
    
    // Then increment it manually
    const newUsesCount = currentData.uses_count + 1;
    
    const { data, error } = await supabase
      .from('discounts')
      .update({ uses_count: newUsesCount })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a new discount code
   */
  async createDiscountCode(discount: Omit<Discount, 'id' | 'created_at' | 'uses_count'>) {
    const { data, error } = await supabase
      .from('discounts')
      .insert([{
        code: discount.code.toUpperCase(),
        amount: discount.amount,
        description: discount.description,
        max_uses: discount.max_uses,
        expiry_date: discount.expiry_date,
        is_active: true,
        uses_count: 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing discount code
   */
  async updateDiscountCode(id: string, discount: Partial<Discount>) {
    const { data, error } = await supabase
      .from('discounts')
      .update(discount)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a discount code
   */
  async deleteDiscountCode(id: string) {
    const { error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  /**
   * Get auto-apply discount for a specific event
   */
  async getAutoApplyDiscountForEvent(eventId: string) {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .eq('auto_apply', true)
      .single();
    
    if (error) return null;
    return data;
  },

  /**
   * Validate an auto-apply discount
   */
  async validateAutoApplyDiscount(discountId: string) {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', discountId)
      .eq('is_active', true)
      .single();
    
    if (error || !data) return null;
    
    // Check if discount is expired
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      return { 
        valid: false, 
        message: 'Discount code has expired' 
      };
    }
    
    // Check if maximum uses reached
    if (data.uses_count >= data.max_uses) {
      return { 
        valid: false, 
        message: 'Discount code has reached maximum usage limit' 
      };
    }
    
    return { 
      valid: true, 
      discount: data 
    };
  }
};
