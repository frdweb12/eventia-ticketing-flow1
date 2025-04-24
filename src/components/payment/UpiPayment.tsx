import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { paymentService } from '@/eventia-backend/services/payment.service';
import { useTranslation } from 'react-i18next';
import QRCodeGenerator from './QRCodeGenerator';

interface UpiSettings {
  upiVPA: string;
  discountAmount: number;
}

interface UpiPaymentProps {
  bookingId: string;
  amount: number;
  onUtrSubmit: (utr: string) => void;
}

const UpiPayment = ({ bookingId, amount, onUtrSubmit }: UpiPaymentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(600); // 10 minutes in seconds

  useEffect(() => {
    const fetchUpiSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await paymentService.getUpiSettings();
        
        if (settings) {
          setUpiId(settings.upiVPA);
        } else {
          setUpiId('eventia@okicici');
        }
      } catch (error) {
        console.error('Error fetching UPI settings:', error);
        setUpiId('eventia@okicici'); // Fallback UPI ID
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpiSettings();
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utrNumber || utrNumber.length < 6) {
      toast({
        title: t('payment.enterValidUtr') || 'Please enter a valid UTR number',
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await paymentService.createPayment({
        booking_id: bookingId,
        utr_number: utrNumber,
        amount: amount,
        status: 'pending'
      });
      
      onUtrSubmit(utrNumber);
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: t('payment.errorProcessing') || 'Error processing payment',
        description: t('payment.tryAgain') || 'Please try again',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('payment.upiPayment') || 'UPI Payment'}</CardTitle>
          <div className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">{t('payment.scanToPayUpi') || 'Scan this QR code to pay via UPI'}</p>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <QRCodeGenerator 
                  value={`upi://pay?pa=${upiId}&am=${amount}&pn=Eventia&tn=TicketBooking`} 
                  size={200}
                  paymentDetails={{
                    upiId: upiId,
                    amount: amount,
                    description: 'Ticket Booking'
                  }}
                />
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="utr" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.utrNumber') || 'UTR Number (Transaction Reference)'}
                </label>
                <Input
                  id="utr"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder={t('payment.enterUtr') || 'Enter UTR after payment'}
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('payment.utrHelp') || 'The UTR number will be provided by your UPI app after successful payment'}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/events')}
                >
                  {t('common.cancel') || 'Cancel'}
                </Button>
                
                <Button 
                  type="submit" 
                  className="gap-2" 
                  disabled={submitting || !utrNumber || remainingTime <= 0}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('payment.processing') || 'Processing...'}
                    </>
                  ) : (
                    <>
                      {t('payment.confirmPayment') || 'Confirm Payment'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-amber-600 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {t('payment.timeLimit') || 'Please complete the payment within the time limit'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiPayment;
