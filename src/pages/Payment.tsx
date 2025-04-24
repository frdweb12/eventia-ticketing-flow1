
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UpiPayment from '@/components/payment/UpiPayment';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Payment = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      setIsLoading(false);
      return;
    }
    
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        navigate('/events');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // First get the booking info - make sure to include event_id
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            id,
            event_id,
            final_amount,
            seats
          `)
          .eq('id', bookingId)
          .single();
          
        if (bookingError) throw bookingError;
        
        if (!bookingData) {
          toast({
            title: "Booking not found",
            description: "Please try again or contact support",
            variant: "destructive"
          });
          navigate('/events');
          return;
        }
        
        // Get the event details from booking's event_id
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('title')
          .eq('id', bookingData.event_id)
          .single();
          
        if (eventError) throw eventError;
        
        // Get delivery details if available
        const { data: deliveryData } = await supabase
          .from('delivery_details')
          .select('*')
          .eq('booking_id', bookingId)
          .maybeSingle();
          
        setBookingDetails({
          eventTitle: eventData?.title || "Event",
          amount: bookingData.final_amount,
          ticketCount: Array.isArray(bookingData.seats) ? bookingData.seats.length : 1,
          deliveryDetails: deliveryData || null
        });
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Error loading booking",
          description: "Please try again later",
          variant: "destructive"
        });
        // Provide fallback booking details to prevent null errors
        setBookingDetails({
          eventTitle: "Event",
          amount: 0,
          ticketCount: 1,
          deliveryDetails: null
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, location.state, navigate]);

  const handleUtrSubmit = (utr: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ensure bookingDetails isn't null before trying to access its properties
  const eventTitle = bookingDetails?.eventTitle || "Event";
  const amount = bookingDetails?.amount || 0;
  const ticketCount = bookingDetails?.ticketCount || 1;

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
              {t('common.back') || 'Back'}
            </Button>
            <LanguageSwitcher />
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{t('payment.title') || 'Payment'}</h1>
              {eventTitle && (
                <p className="text-gray-600">
                  {t('payment.subtitle', { eventTitle }) || `Complete your payment for ${eventTitle}`}
                </p>
              )}
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.totalAmount') || 'Total Amount'}</p>
                    <p className="text-xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.tickets') || 'Tickets'}</p>
                    <p className="font-medium">
                      {ticketCount} {ticketCount === 1 ? (t('common.ticket') || 'Ticket') : (t('common.tickets') || 'Tickets')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <UpiPayment 
              bookingId={bookingId || '0'}
              amount={amount}
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
