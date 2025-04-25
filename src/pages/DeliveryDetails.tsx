
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DeliveryDetailsForm from '@/components/payment/DeliveryDetailsForm';
import { toast } from '@/hooks/use-toast';

const DeliveryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingDetails = location.state?.bookingDetails;
  
  // If no booking details, redirect to events page
  if (!bookingDetails) {
    React.useEffect(() => {
      toast({
        title: "No booking details found",
        description: "Please select your tickets first",
        variant: "destructive"
      });
      navigate('/events');
    }, []);
    return null;
  }
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Delivery Details</h1>
              <p className="text-gray-600">
                For event: {bookingDetails.eventTitle}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Amount to pay: ₹{bookingDetails.amount}
              </p>
            </div>
            
            <DeliveryDetailsForm 
              bookingId={bookingDetails.bookingId}
              eventTitle={bookingDetails.eventTitle}
              amount={bookingDetails.amount}
              onBack={handleBack}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeliveryDetails;
