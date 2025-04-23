
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import QRCodeGenerator from './QRCodeGenerator';
import { usePaymentSettings } from '@/hooks/use-payment-settings';
import DiscountForm from './DiscountForm';
import { Separator } from '@/components/ui/separator';

interface UpiPaymentProps {
  bookingId: string;
  amount: number;
  onUtrSubmit: (utr: string) => void;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({ bookingId, amount, onUtrSubmit }) => {
  const { t } = useTranslation();
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(amount);
  const [appliedCode, setAppliedCode] = useState('');
  const { settings, isLoading } = usePaymentSettings(true);

  // Reset discounted amount if original amount changes
  useEffect(() => {
    if (!appliedCode) {
      setDiscountedAmount(amount);
    }
  }, [amount, appliedCode]);

  const handleApplyDiscount = (discountAmount: number, code: string) => {
    if (discountAmount > 0 && code) {
      const newAmount = Math.max(amount - discountAmount, 0);
      setDiscountedAmount(newAmount);
      setAppliedCode(code);
    } else {
      setDiscountedAmount(amount);
      setAppliedCode('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utrNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid UTR number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would verify the UTR number here
    setTimeout(() => {
      setIsSubmitting(false);
      onUtrSubmit(utrNumber);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  const upiVpa = settings?.upiVPA || 'eventia@upi';
  const finalAmount = Math.max(discountedAmount, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">{t('payment.upiPayment') || 'UPI Payment'}</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4">{t('payment.scanQR') || 'Scan QR Code'}</h3>
          <QRCodeGenerator
            upiVPA={upiVpa}
            amount={finalAmount}
            transactionNote={`Booking #${bookingId}`}
          />
          
          <div className="mt-4 w-full">
            <div className="text-sm text-gray-500 mb-1">{t('payment.payeeDetails') || 'Payee Details'}</div>
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('payment.merchantName') || 'Merchant Name'}</span>
                <span className="text-sm font-medium">Eventia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('payment.merchantVPA') || 'UPI ID'}</span>
                <span className="text-sm font-medium">{upiVpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('payment.transactionNote') || 'Transaction Note'}</span>
                <span className="text-sm font-medium">Booking #{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('payment.totalAmount') || 'Total Amount'}</span>
                <span className="text-sm font-medium">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">{t('payment.submitUTR') || 'Submit UTR Number'}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('payment.utrDescription') || 'After making the payment, please enter the UTR number you received.'}
          </p>
          
          <DiscountForm 
            onApplyDiscount={handleApplyDiscount} 
            disabled={isSubmitting}
          />
          
          {appliedCode && (
            <div className="mt-2 mb-4 text-green-600 text-sm">
              Discount of ₹{(amount - discountedAmount).toLocaleString('en-IN')} applied!
            </div>
          )}
          
          <Separator className="my-4" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="utr" className="text-sm font-medium">
                  {t('payment.enterUTR') || 'Enter UTR Number'}
                </label>
                <span className="text-sm text-primary font-semibold">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <Input
                id="utr"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder={t('payment.utrPlaceholder') || 'Enter 12-digit UTR number'}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('payment.utrHelper') || 'The UTR number is provided by your bank after payment is completed'}
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={!utrNumber.trim() || isSubmitting}
            >
              {isSubmitting ? (t('common.processing') || 'Processing...') : (t('payment.confirmPayment') || 'Confirm Payment')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
