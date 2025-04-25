
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { iplMatches, IPLMatch } from '@/data/iplData';
import { events, Event } from '@/data/eventsData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SeatMap from '@/components/booking/SeatMap';
import { Calendar, Clock, MapPin, Tag, ArrowLeft, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { v4 as uuidv4 } from 'uuid';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'booked' | 'locked' | 'selected';
  price: number;
  category: string;
}

const EventDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | IPLMatch | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    const foundMatch = iplMatches.find(m => m.id === id);
    
    const foundItem = foundEvent || foundMatch;
    
    if (foundItem) {
      setEvent(foundItem);
    } else {
      navigate('/not-found');
    }
  }, [id, navigate]);

  // Add the missing handleSeatSelect function
  const handleSeatSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const handleAddToCart = () => {
    if (activeTab === 'seating' && selectedSeats.length === 0) {
      toast({
        title: "Please select seats",
        description: "Choose at least one seat to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'info' && !selectedTicket) {
      toast({
        title: "Please select a ticket type",
        description: "Choose the type of ticket you want to purchase.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    const bookingId = uuidv4();
    
    const totalAmount = activeTab === 'info' 
      ? selectedTicket.price * quantity
      : selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    navigate('/delivery-details', {
      state: {
        bookingDetails: {
          bookingId,
          eventTitle: event?.title,
          eventDate: event?.date,
          eventTime: event?.time,
          venue: event?.venue,
          amount: totalAmount,
          ticketCount: activeTab === 'info' ? quantity : selectedSeats.length
        }
      }
    });
    
    setIsProcessing(false);
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <LanguageSwitcher />
          </div>

          <div className="lg:flex gap-8">
            <div className="lg:w-2/3">
              <Card className="bg-transparent border-none text-white shadow-none">
                <div className="aspect-video overflow-hidden rounded-lg mb-6">
                  <img
                    src={(event as Event).posterImage || event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader className="px-0">
                  <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
                  {'teams' in event && (
                    <CardDescription className="text-gray-300 text-lg">
                      {event.teams.team1.name} vs {event.teams.team2.name}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="px-0 space-y-6">
                  {'description' in event && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">About the Event</h3>
                      <p className="text-gray-300">{event.description}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Date</p>
                          <p className="text-gray-300">{event.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Time</p>
                          <p className="text-gray-300">{event.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Venue</p>
                          <p className="text-gray-300">{event.venue}</p>
                        </div>
                      </div>
                      
                      {'duration' in event && (
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-semibold">Duration</p>
                            <p className="text-gray-300">{event.duration}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book Tickets</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">General</TabsTrigger>
                      <TabsTrigger value="seating">Select Seats</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{t('eventDetails.tickets')}</h3>
                        {event.ticketTypes.map((ticket, index) => (
                          <div
                            key={index}
                            className={`border rounded-md p-3 mb-2 cursor-pointer ${selectedTicket === ticket ? 'border-primary' : 'border-gray-200'}`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{ticket.category}</p>
                                <p className="text-sm text-gray-500">₹{ticket.price}</p>
                              </div>
                              <p className="text-sm text-gray-500">{ticket.available} {t('eventDetails.available')}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{t('eventDetails.quantity')}</h3>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-2">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleAddToCart}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            {t('common.processing')}
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {t('eventDetails.proceedToPayment')}
                          </>
                        )}
                      </Button>
                    </TabsContent>
                    <TabsContent value="seating">
                      <SeatMap 
                        venueId={id || '0'} 
                        sectionId="A1" 
                        onSeatSelect={handleSeatSelect}
                        selectedSeats={selectedSeats}
                      />

                      {selectedSeats.length > 0 && (
                        <Button 
                          className="w-full mt-4" 
                          onClick={handleAddToCart}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              {t('common.processing')}
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {t('eventDetails.proceedToPayment')}
                            </>
                          )}
                        </Button>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-4">
                <Link to={`/venue-preview/${id}`}>
                  <Button variant="outline" size="lg" className="w-full">
                    <Eye className="h-5 w-5 mr-2" />
                    {t('events.viewVenue')}
                  </Button>
                </Link>
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
