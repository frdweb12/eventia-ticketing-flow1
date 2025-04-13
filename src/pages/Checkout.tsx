
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { events } from '@/data/eventsData';
import { iplMatches } from '@/data/iplData';
import { ArrowLeft, Copy, Ticket, CheckCircle2, FileText } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const eventId = searchParams.get('eventId');
  const category = searchParams.get('category');
  const quantity = parseInt(searchParams.get('quantity') || '0');
  
  // Find the event or match
  const event = events.find(e => e.id === eventId);
  const match = iplMatches.find(m => m.id === eventId);
  const data = event || match;
  
  // If no valid data found, redirect to home
  useEffect(() => {
    if (!data || !category || !quantity) {
      navigate('/');
    }
  }, [data, category, quantity, navigate]);
  
  // Find the ticket type
  const ticketType = data?.ticketTypes.find(t => t.category === category);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [utr, setUtr] = useState('');
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Calculate totals
  const subtotal = ticketType ? ticketType.price * quantity : 0;
  const convenienceFee = Math.round(subtotal * 0.05);
  const total = subtotal + convenienceFee;
  
  // Handle address submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !address) {
      toast({
        title: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a 10-digit phone number",
        variant: "destructive"
      });
      return;
    }
    
    setFormStep(2);
  };
  
  // Handle UTR submission
  const handleUtrSubmit = () => {
    if (!utr || utr.length < 8) {
      toast({
        title: "Invalid UTR number",
        description: "Please enter a valid UTR reference",
        variant: "destructive"
      });
      return;
    }
    
    setIsPaymentComplete(true);
    toast({
      title: "Payment verification initiated",
      description: "We will verify your payment and dispatch your tickets soon.",
    });
    
    // In a real app, we would submit to the backend here
  };
  
  // Mock UPI VPA for QR payment
  const upiVpa = "eventia@ybl";
  
  // Handle copy UPI ID
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiVpa);
    toast({
      title: "UPI ID copied to clipboard",
    });
  };
  
  // If no data, show loading
  if (!data || !ticketType) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading checkout information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your booking in a few simple steps</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Step 1: Delivery Address */}
              {formStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">1</span>
                    Delivery Address
                  </h2>
                  
                  <form onSubmit={handleAddressSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          required
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                        <Textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your full address including city, state, and PIN code"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <AnimatedButton type="submit">
                        Continue to Payment
                      </AnimatedButton>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Step 2: Payment */}
              {formStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">2</span>
                    Payment via UPI
                  </h2>
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center mb-4">
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        {/* This would be a real QR code in production */}
                        <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500">QR Code Placeholder</span>
                        </div>
                      </div>
                      
                      <div className="text-center mb-4">
                        <p className="text-gray-600 mb-2">Scan this QR code using any UPI app</p>
                        <div className="flex items-center justify-center">
                          <p className="font-medium mr-2">{upiVpa}</p>
                          <Button variant="ghost" size="icon" onClick={handleCopyUpiId}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        <img src="/placeholder.svg" alt="Google Pay" className="h-8" />
                        <img src="/placeholder.svg" alt="PhonePe" className="h-8" />
                        <img src="/placeholder.svg" alt="Paytm" className="h-8" />
                        <img src="/placeholder.svg" alt="BHIM" className="h-8" />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="mb-4">
                        <p className="font-medium mb-2">Enter UTR number after payment:</p>
                        <p className="text-sm text-gray-600 mb-4">
                          After making the payment, you'll receive a UTR (Unique Transaction Reference) number.
                          Please enter it below to verify your payment.
                        </p>
                        
                        <Input
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="Enter UTR number"
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          UTR number can be found in your payment app's transaction history
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <AnimatedButton onClick={handleUtrSubmit}>
                          Submit UTR & Complete Booking
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Confirmation */}
              {isPaymentComplete && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Complete!</h2>
                    <p className="text-gray-600 mb-6">
                      Your payment is being verified. Tickets will be delivered to your address within 2 days.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                      <p className="font-medium">Booking Reference:</p>
                      <p className="text-xl font-bold">EVT-{Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        View Receipt
                      </Button>
                      <Button onClick={() => navigate('/')} className="flex items-center">
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-primary" />
                  Order Summary
                </h2>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="font-medium mb-1">{data.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(data.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} • {data.time}
                  </p>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>{ticketType.category} x {quantity}</span>
                    <span>₹{ticketType.price * quantity}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Important Information:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Tickets will be delivered to your address within 2 days</li>
                    <li>Cancellations are not allowed after booking</li>
                    <li>Please bring a valid ID for entry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
