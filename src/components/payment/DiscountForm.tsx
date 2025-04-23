
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { discountService } from '@/eventia-backend/services/discount.service';

interface DiscountFormProps {
  onApplyDiscount: (amount: number, code: string) => void;
  disabled?: boolean;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ onApplyDiscount, disabled = false }) => {
  const { t } = useTranslation();
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

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
      
      onApplyDiscount(result.discount.amount, result.discount.code);
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
