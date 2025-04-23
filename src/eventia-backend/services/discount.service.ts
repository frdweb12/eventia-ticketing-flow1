
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Discount } from '../models';

type DiscountRow = Database['public']['Tables']['discounts']['Row'];
type DiscountInsert = Database['public']['Tables']['discounts']['Insert'];

export const discountService = {
  /**
   * Create a new discount code
   */
  async createDiscount(discount: Omit<DiscountInsert, 'id' | 'created_at' | 'uses_count'>) {
    const { data, error } = await supabase
      .from('discounts')
      .insert([{
        ...discount,
        uses_count: 0,
        is_active: true
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data as Discount;
  },
  
  /**
   * Get all active discount codes
   */
  async getActiveDiscounts() {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true);
      
    if (error) throw error;
    return data as Discount[];
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
      
    if (error) {
      // No discount found with this code
      return null;
    }
    
    const discount = data as Discount;
    
    // Check if discount has expired
    if (discount.expiry_date && new Date(discount.expiry_date) < new Date()) {
      return { valid: false, message: 'Discount code has expired' };
    }
    
    // Check if discount has reached max uses
    if (discount.uses_count >= discount.max_uses) {
      return { valid: false, message: 'Discount code has reached maximum usage limit' };
    }
    
    return { 
      valid: true, 
      discount: {
        code: discount.code,
        amount: discount.amount,
        id: discount.id
      }
    };
  },
  
  /**
   * Apply a discount code to a booking
   */
  async applyDiscountCode(discountId: string) {
    // First get the current discount
    const { data: discount, error: discountError } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', discountId)
      .single();
      
    if (discountError) throw discountError;
    
    // Increment the uses count
    const { error: updateError } = await supabase
      .from('discounts')
      .update({ uses_count: (discount?.uses_count || 0) + 1 })
      .eq('id', discountId);
    
    if (updateError) throw updateError;
    
    return true;
  }
};
