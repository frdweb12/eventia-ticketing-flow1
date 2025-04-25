
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { discountService } from '@/eventia-backend/services/discount.service';
import { Badge } from '@/components/ui/badge';
import { TagIcon } from 'lucide-react';

interface DiscountFormProps {
  eventId?: string;
  onApplyDiscount: (amount: number, code: string, isAutoApplied?: boolean) => void;
  disabled?: boolean;
  initialDiscount?: { 
    amount: number; 
    code: string; 
    isAutoApplied?: boolean;
  };
}

const DiscountForm: React.FC<DiscountFormProps> = ({ 
  eventId, 
  onApplyDiscount, 
  disabled = false,
  initialDiscount 
}) => {
  const { t } = useTranslation();
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [autoApplyDiscount, setAutoApplyDiscount] = useState<any>(null);

  // Try to fetch auto-apply discount when component mounts
  useEffect(() => {
    const fetchAutoApplyDiscount = async () => {
      if (eventId) {
        const autoDiscount = await discountService.getAutoApplyDiscountForEvent(eventId);
        if (autoDiscount) {
          setAutoApplyDiscount(autoDiscount);
          onApplyDiscount(autoDiscount.amount, autoDiscount.code, true);
        }
      }
    };

    // If no initial discount is provided, try to fetch auto-apply
    if (!initialDiscount) {
      fetchAutoApplyDiscount();
    } else {
      // If initial discount is provided (likely from parent component)
      setDiscountCode(initialDiscount.code);
      setIsApplied(true);
    }
  }, [eventId, onApplyDiscount, initialDiscount]);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discountCode.trim()) {
      toast({
        title: t('payment.invalidDiscountCode'),
        description: t('payment.enterValidCode'),
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await discountService.validateDiscountCode(discountCode);
      
      if (!result || !result.valid) {
        toast({
          title: t('payment.invalidDiscountCode'),
          description: result?.message || t('payment.discountNotValid'),
          variant: "destructive",
        });
        return;
      }
      
      // Manual discount takes precedence over auto-apply
      onApplyDiscount(result.discount.amount, result.discount.code, false);
      setIsApplied(true);
      
      toast({
        title: t('payment.discountApplied'),
        description: t('payment.savedAmount', { amount: result.discount.amount }),
      });
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: t('common.error'),
        description: t('payment.errorValidatingDiscount'),
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetDiscount = () => {
    setDiscountCode('');
    setIsApplied(false);
    onApplyDiscount(0, '');
  };

  // Render auto-applied discount
  if (autoApplyDiscount) {
    return (
      <div className="mt-4 mb-2">
        <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
          <div className="flex items-center">
            <TagIcon className="h-5 w-5 mr-2 text-green-600" />
            <div>
              <span className="text-green-700 font-medium">{autoApplyDiscount.code}</span>
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                Auto Applied
              </Badge>
              <p className="text-xs text-green-600">
                {t('payment.autoDiscountApplied', { amount: autoApplyDiscount.amount })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default discount form
  return (
    <div className="mt-4 mb-2">
      <h3 className="text-sm font-medium mb-2">{t('payment.haveDiscount')}</h3>
      {!isApplied ? (
        <form onSubmit={handleApplyDiscount} className="flex space-x-2">
          <Input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder={t('payment.enterDiscountCode')}
            className="flex-grow"
            disabled={disabled || isValidating}
          />
          <Button 
            type="submit" 
            variant="outline" 
            disabled={disabled || isValidating || !discountCode.trim()}
          >
            {isValidating ? t('common.processing') : t('payment.apply')}
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
          <div>
            <span className="text-green-700 font-medium">{discountCode}</span>
            <p className="text-xs text-green-600">{t('payment.discountApplied')}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetDiscount} className="text-red-600">
            {t('payment.remove')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscountForm;
