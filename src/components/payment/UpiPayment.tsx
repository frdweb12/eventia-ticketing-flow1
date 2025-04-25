import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Clock, AlertTriangle, CheckCircle, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QRCodeGenerator from './QRCodeGenerator';
import * as paymentApi from '@/services/api/paymentApi';
import { UpiSettings } from '@/services/api/paymentApi';

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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [qrLoadError, setQrLoadError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUpiSettings = async () => {
      try {
        setIsLoading(true);
        setQrLoadError(false);
        
        const response = await paymentApi.getUpiSettings();
        
        if (response.data?.upiVPA) {
          setUpiId(response.data.upiVPA);
        } else {
          setUpiId('eventia@okicici'); // Fallback UPI ID
          console.info('Using fallback UPI ID as no settings found');
        }
      } catch (error) {
        console.error('Error fetching UPI settings:', error);
        setQrLoadError(true);
        setUpiId('eventia@okicici'); // Fallback UPI ID
        toast({
          title: t('payment.errorFetchingUpi') || 'Error fetching UPI details',
          description: t('payment.usingFallback') || 'Using fallback UPI ID',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check if payment already exists for this booking
    const checkExistingPayment = async () => {
      try {
        const response = await paymentApi.getPaymentByBookingId(bookingId);
        
        // If payment exists and has UTR number, pre-fill it
        if (response.data && response.data.utr_number) {
          setUtrNumber(response.data.utr_number);
          toast({
            title: t('payment.existingUtrFound') || 'Existing UTR found',
            description: t('payment.utrPrefilled') || 'Your previous UTR number has been filled',
          });
        }
      } catch (error) {
        // Silently fail - it's okay if there's no existing payment
        console.log('No existing payment found:', error);
      }
    };

    fetchUpiSettings();
    if (bookingId) checkExistingPayment();
  }, [bookingId, t]);

  useEffect(() => {
    if (remainingTime <= 0) {
      toast({
        title: t('payment.timeExpired') || 'Payment time expired',
        description: t('payment.refreshPage') || 'Please refresh the page to try again',
        variant: "destructive",
      });
      return;
    }
    
    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime, t]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    
    if (!utrNumber || utrNumber.length < 6) {
      toast({
        title: t('payment.enterValidUtr') || 'Please enter a valid UTR number',
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await paymentApi.createPayment({
        booking_id: bookingId,
        amount: amount,
        utr_number: utrNumber,
      });
      
      toast({
        title: t('payment.utrSubmitted') || 'Payment details submitted successfully',
        description: t('payment.waitingVerification') || 'Please wait for verification',
      });
      
      onUtrSubmit(utrNumber);
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      setPaymentError(
        error?.response?.data?.message || 
        t('payment.errorProcessing') || 
        'Error processing payment'
      );
      
      toast({
        title: t('payment.errorProcessing') || 'Error processing payment',
        description: t('payment.tryAgain') || 'Please try again',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const refreshQrCode = () => {
    setQrLoadError(false);
    const fetchUpiSettings = async () => {
      try {
        setIsLoading(true);
        const response = await paymentApi.getUpiSettings();
        
        if (response.data?.upiVPA) {
          setUpiId(response.data.upiVPA);
          toast({
            title: t('payment.qrRefreshed') || 'QR code refreshed',
            description: t('payment.scanToPayUpdated') || 'Scan the updated QR code to pay',
          });
        } else {
          setUpiId('eventia@okicici');
        }
      } catch (error) {
        console.error('Error refreshing UPI settings:', error);
        setQrLoadError(true);
        toast({
          title: t('payment.errorRefreshingQr') || 'Error refreshing QR',
          description: t('payment.tryAgain') || 'Please try again',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpiSettings();
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
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">{t('payment.scanToPayUpi') || 'Scan this QR code to pay via UPI'}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshQrCode} 
                disabled={isLoading}
              >
                <QrCode className="h-4 w-4 mr-1" />
                {t('payment.refreshQr') || 'Refresh QR'}
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : qrLoadError ? (
              <div className="py-8 flex flex-col items-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                <p className="text-amber-600">
                  {t('payment.errorLoadingQr') || 'Error loading QR code'}
                </p>
                <Button 
                  variant="outline"
                  className="mt-2"
                  onClick={refreshQrCode}
                >
                  {t('payment.tryAgain') || 'Try Again'}
                </Button>
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
              
              {paymentError && (
                <div className="bg-red-50 p-3 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{paymentError}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/events')}
                  disabled={submitting}
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
            {remainingTime <= 120 ? (
              <p className="text-red-600 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {t('payment.timeRunningOut') || 'Time is running out! Complete your payment soon.'}
              </p>
            ) : (
              <p className="text-amber-600 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {t('payment.timeLimit') || 'Please complete the payment within the time limit'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiPayment;
