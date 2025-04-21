
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, CreditCard, Clipboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UpiPaymentProps {
  bookingId: string;
  amount: number;
  onUtrSubmit: (utr: string) => void;
}

interface PaymentData {
  qrCode: string;
  vpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({ bookingId, amount, onUtrSubmit }) => {
  const { t } = useTranslation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch(`/api/payments/links/${bookingId}`);
        // const data = await response.json();
        
        // For now, mock the response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData: PaymentData = {
          qrCode: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
          vpa: 'eventia@upi',
          payeeName: 'Eventia Tickets Pvt Ltd',
          amount: amount,
          transactionNote: `Ticket-${bookingId}`
        };
        
        setPaymentData(mockData);
      } catch (error) {
        console.error('Error fetching payment link:', error);
        toast({
          title: "Error fetching payment details",
          description: "Please try again or contact support",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLink();
  }, [bookingId, amount]);

  const handleCopyVpa = () => {
    if (!paymentData) return;
    
    navigator.clipboard.writeText(paymentData.vpa)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "UPI ID copied",
          description: `${paymentData.vpa} copied to clipboard`,
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive"
        });
      });
  };

  const handleUtrSubmit = () => {
    if (!utrNumber.trim()) {
      toast({
        title: "UTR number is required",
        description: "Please enter the UTR number from your payment receipt",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, call the API to submit UTR
    // Example: 
    // fetch(`/api/bookings/${bookingId}/submit-utr`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ utr: utrNumber })
    // })

    // For now, simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onUtrSubmit(utrNumber);
      toast({
        title: "UTR submitted successfully",
        description: "Your ticket will be confirmed shortly",
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{t('payment.errorLoading')}</p>
        <Button 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('payment.upiPayment')}</CardTitle>
          <CardDescription>
            {t('payment.scanQrOrPayManually')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md flex justify-center">
            <img 
              src={paymentData.qrCode} 
              alt="UPI QR Code" 
              className="h-64 w-64 object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{t('payment.upiId')}</p>
                <p className="font-medium">{paymentData.vpa}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyVpa}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {isCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('payment.payeeName')}</p>
              <p className="font-medium">{paymentData.payeeName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('payment.amount')}</p>
              <p className="font-medium text-lg">₹{paymentData.amount.toLocaleString('en-IN')}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('payment.transactionNote')}</p>
              <p className="font-medium">{paymentData.transactionNote}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">{t('payment.enterUtr')}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {t('payment.utrDescription')}
            </p>
            <div className="space-y-2">
              <Input
                placeholder="UTR Number (12-digit)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="font-mono"
                maxLength={12}
              />
              <p className="text-xs text-gray-500">
                {t('payment.utrLocation')}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUtrSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {t('payment.verifying')}
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-2" />
                {t('payment.submitUtr')}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpiPayment;
