
import { supabase } from '@/integrations/supabase/client';
import { Discount } from '../models';

export const discountService = {
  /**
   * Get all discount codes
   */
  async getAllDiscounts() {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Discount[];
  },
  
  /**
   * Get active discount codes
   */
  async getActiveDiscounts() {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .or(`expiry_date.gt.${now},expiry_date.is.null`)
      .lt('uses_count', supabase.raw('max_uses'))
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Discount[];
  },
  
  /**
   * Get discount by code
   */
  async getDiscountByCode(code: string) {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', code)
      .single();
      
    if (error) return null;
    return data as Discount;
  },
  
  /**
   * Create a new discount code
   */
  async createDiscount(discount: Omit<Discount, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('discounts')
      .insert([discount])
      .select();
      
    if (error) throw error;
    return data[0] as Discount;
  },
  
  /**
   * Update a discount code
   */
  async updateDiscount(id: string, discount: Partial<Discount>) {
    const { data, error } = await supabase
      .from('discounts')
      .update(discount)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Discount;
  },
  
  /**
   * Increment the usage count of a discount
   */
  async incrementDiscountUsage(id: string) {
    const { data, error } = await supabase
      .from('discounts')
      .update({ 
        uses_count: supabase.raw('uses_count + 1') 
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0] as Discount;
  },
  
  /**
   * Validate a discount code
   * Returns the discount if valid, null otherwise
   */
  async validateDiscountCode(code: string) {
    const discount = await this.getDiscountByCode(code);
    
    if (!discount) return null;
    
    // Check if discount is active
    if (!discount.is_active) return null;
    
    // Check if discount has reached max uses
    if (discount.uses_count >= discount.max_uses) return null;
    
    // Check if discount has expired
    if (discount.expiry_date && new Date(discount.expiry_date) < new Date()) return null;
    
    return discount;
  }
};
