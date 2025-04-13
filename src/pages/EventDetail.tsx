
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { events } from '@/data/eventsData';
import { iplMatches } from '@/data/iplData';
import { Calendar, MapPin, Clock, ArrowLeft, Plus, Minus, Ticket } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the event or match
  const event = events.find(e => e.id === id);
  const match = iplMatches.find(m => m.id === id);
  
  // If neither found, show not found
  if (!event && !match) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Combine data regardless of type
  const data = event || match;
  const isMatch = !!match;
  
  // State for ticket selection
  const [selectedTicket, setSelectedTicket] = useState<{
    category: string;
    price: number;
    quantity: number;
  } | null>(null);
  
  const ticketTypes = data?.ticketTypes || [];
  
  // Handle quantity change
  const changeQuantity = (value: number) => {
    if (!selectedTicket) return;
    
    const newQuantity = selectedTicket.quantity + value;
    if (newQuantity < 1) return;
    
    const ticketType = ticketTypes.find(t => t.category === selectedTicket.category);
    if (!ticketType || newQuantity > ticketType.available) return;
    
    setSelectedTicket({
      ...selectedTicket,
      quantity: newQuantity
    });
  };
  
  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!selectedTicket || selectedTicket.quantity < 1) {
      toast({
        title: "Please select tickets",
        description: "You need to select at least 1 ticket to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would save the selection to state or context
    // For now, just navigate to checkout with params
    navigate(`/checkout?eventId=${data?.id}&category=${selectedTicket.category}&quantity=${selectedTicket.quantity}`);
  };

  // Format date
  const formattedDate = new Date(data?.date || '').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Details */}
            <div className="lg:col-span-2">
              {/* Title and Category */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {isMatch ? 'IPL Match' : data?.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{data?.title}</h1>
              </div>
              
              {/* Image */}
              <div className="mb-8">
                <img 
                  src={data?.image} 
                  alt={data?.title} 
                  className="w-full h-auto rounded-xl shadow-md"
                />
              </div>
              
              {/* Event/Match Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <span>{data?.time} {isMatch ? 'IST' : ''} • {isMatch ? '~4 hours' : data?.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <span>{data?.venue}</span>
                  </div>
                </div>
              </div>
              
              {/* Teams (for IPL matches only) */}
              {isMatch && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h2 className="text-xl font-semibold mb-4">Teams</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <span className="font-bold">{match?.teams.team1.shortName}</span>
                      </div>
                      <span className="text-sm font-medium">{match?.teams.team1.name}</span>
                    </div>
                    
                    <div className="font-bold text-2xl text-gray-400">VS</div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <span className="font-bold">{match?.teams.team2.shortName}</span>
                      </div>
                      <span className="text-sm font-medium">{match?.teams.team2.name}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Description */}
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">About {isMatch ? 'This Match' : 'This Event'}</h2>
                {isMatch ? (
                  <p className="text-gray-700">
                    Witness the excitement of the IPL as {match?.teams.team1.name} takes on {match?.teams.team2.name} in this high-stakes 
                    T20 clash at {match?.venue}. Be part of the electrifying atmosphere with thousands of passionate cricket fans. 
                    Get your tickets now before they sell out!
                  </p>
                ) : (
                  <p className="text-gray-700">{event?.description}</p>
                )}
              </div>
            </div>
            
            {/* Ticket Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-24 ticket-shape">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-primary" />
                  Select Tickets
                </h2>
                
                <div className="space-y-4 mb-6">
                  {ticketTypes.map((ticket) => (
                    <div 
                      key={ticket.category}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTicket?.category === ticket.category 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTicket({
                        category: ticket.category,
                        price: ticket.price,
                        quantity: 1
                      })}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{ticket.category}</h3>
                          <p className="text-gray-600 text-sm">{ticket.available} tickets left</p>
                        </div>
                        <span className="font-bold">₹{ticket.price}</span>
                      </div>
                      
                      {selectedTicket?.category === ticket.category && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeQuantity(-1);
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-4 font-medium">{selectedTicket.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeQuantity(1);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="font-bold">
                            ₹{selectedTicket.price * selectedTicket.quantity}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedTicket && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{selectedTicket.price * selectedTicket.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Convenience Fee</span>
                      <span>₹{Math.round(selectedTicket.price * selectedTicket.quantity * 0.05)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{selectedTicket.price * selectedTicket.quantity + Math.round(selectedTicket.price * selectedTicket.quantity * 0.05)}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <AnimatedButton 
                    className="w-full" 
                    size="lg"
                    onClick={handleProceedToCheckout}
                    animation="pulse"
                  >
                    Proceed to Checkout
                  </AnimatedButton>
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

export default EventDetail;
