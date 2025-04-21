
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UpiPayment from '@/components/payment/UpiPayment';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Payment = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // In a real app, this would come from the location state or be fetched
  const bookingDetails = location.state?.bookingDetails || {
    eventTitle: 'Event Title',
    amount: 5000,
    ticketCount: 2
  };

  const handleUtrSubmit = (utr: string) => {
    setIsProcessing(true);
    
    // In a real app, this would call the API and wait for a response
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to confirmation page
      navigate(`/confirmation/${bookingId}`, {
        state: {
          utr,
          bookingDetails: {
            ...bookingDetails,
            bookingId
          }
        }
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center my-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              disabled={isProcessing}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <LanguageSwitcher />
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{t('payment.title')}</h1>
              <p className="text-gray-600">
                {t('payment.subtitle', { eventTitle: bookingDetails.eventTitle })}
              </p>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.totalAmount')}</p>
                    <p className="text-xl font-bold">₹{bookingDetails.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.tickets')}</p>
                    <p className="font-medium">
                      {bookingDetails.ticketCount} {bookingDetails.ticketCount === 1 ? t('common.ticket') : t('common.tickets')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <UpiPayment 
              bookingId={bookingId || '0'}
              amount={bookingDetails.amount}
              onUtrSubmit={handleUtrSubmit}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
