
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PaymentSettings {
  upiVPA: string;
  discountCode: string | null;
  discountAmount: number | null;
  updatedAt: string;
}

export const usePaymentSettings = (shouldRefresh: boolean = false) => {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually trigger a refresh
  const refreshSettings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the latest payment settings
        const { data, error } = await supabase
          .from('payment_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setSettings({
            upiVPA: data.upi_vpa,
            discountCode: data.discount_code,
            discountAmount: data.discount_amount,
            updatedAt: data.updated_at
          });
        } else {
          // Use default values if no settings are found
          setSettings({
            upiVPA: 'default@upi',
            discountCode: null,
            discountAmount: 0,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err: any) {
        console.error('Error fetching payment settings:', err);
        setError(err);
        
        // Fall back to default settings
        setSettings({
          upiVPA: 'default@upi',
          discountCode: null,
          discountAmount: 0,
          updatedAt: new Date().toISOString()
        });
        
        toast({
          title: "Error loading payment settings",
          description: "Using default settings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
    
    // Set up real-time subscription if shouldRefresh is true
    if (shouldRefresh) {
      const subscription = supabase
        .channel('payment_settings_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'payment_settings' }, 
          (payload) => {
            // Refresh settings on any change
            refreshSettings();
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [refreshTrigger, shouldRefresh]);
  
  return { settings, isLoading, error, refreshSettings };
};
