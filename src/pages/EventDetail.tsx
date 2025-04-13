import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { iplMatches, IPLMatch } from '@/data/iplData';
import { events, Event } from '@/data/eventsData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, Clock, MapPin, Tag, ArrowLeft, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | IPLMatch | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find the event or match by ID
    const foundEvent = events.find(e => e.id === id);
    const foundMatch = iplMatches.find(m => m.id === id);
    
    const foundItem = foundEvent || foundMatch;
    
    if (foundItem) {
      setEvent(foundItem);
    } else {
      // Redirect to a "not found" page or display an error message
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedTicket) {
      toast({
        title: "Please select a ticket type",
        description: "Choose the type of ticket you want to purchase.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation to prevent adding more tickets than available
    if (quantity > selectedTicket.available) {
      toast({
        title: "Not enough tickets available",
        description: `Only ${selectedTicket.available} tickets left for ${selectedTicket.category}.`,
        variant: "destructive"
      });
      return;
    }

    // Here, you would typically add the selected ticket and quantity to a cart
    // For this example, we'll just show a success message
    toast({
      title: "Tickets added to cart",
      description: `${quantity} ${selectedTicket.category} ticket(s) added to your cart.`,
    });

    // Redirect to checkout page
    navigate('/checkout');
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

      <main className="flex-grow bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                  {'teams' in event && (
                    <CardDescription className="text-gray-500">
                      {event.teams.team1.name} vs {event.teams.team2.name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-gray-700">
                  {'description' in event && <p className="mb-4">{event.description}</p>}
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {event.date}
                  </div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {event.time}
                  </div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {event.venue}
                  </div>
                  {'duration' in event && (
                    <div className="flex items-center mb-4">
                      <Tag className="h-4 w-4 mr-2 text-gray-400" />
                      Duration: {event.duration}
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Tickets</h3>
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
                          <p className="text-sm text-gray-500">{ticket.available} available</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Quantity</h3>
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

                  <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
          
          <div className="mt-6 text-center">
            <Link to={`/venue-preview/${id}`}>
              <Button variant="secondary" size="lg" className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                View Venue in AR
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
