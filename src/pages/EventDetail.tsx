
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, events } from '@/data/eventsData';
import { IPLMatch, iplMatches } from '@/data/iplData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';

// Fix the params type to satisfy the constraint
interface EventDetailParams {
  id: string;
  [key: string]: string;
}

const EventDetail = () => {
  const { id } = useParams<EventDetailParams>();

  // Combine both events and IPL matches into a single array
  const allEvents: (Event | IPLMatch)[] = [...events, ...iplMatches];

  // Find the event by ID from the combined array
  const event = allEvents.find(event => event.id === id);

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600">Sorry, the event you are looking for does not exist.</p>
            <Link to="/events" className="text-primary hover:underline">
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Add a type guard function to differentiate between Event and IPLMatch
  const isEvent = (item: Event | IPLMatch): item is Event => {
    return 'category' in item && 'duration' in item;
  };

  // Inside your component where you're displaying category and duration
  // Replace the problematic lines with conditional rendering:

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/events" className="text-primary hover:underline">
              ← Back to Events
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{formattedDate} • {event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{event.venue}</span>
                </div>

                {isEvent(event) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2 text-primary/70" />
                    <span>{event.category}</span>
                  </div>
                )}

                {isEvent(event) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-primary/70" />
                    <span>{event.duration}</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{event.description}</p>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Ticket Types</h2>
                <div className="space-y-3">
                  {event.ticketTypes.map(ticket => (
                    <div key={ticket.category} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{ticket.category}</div>
                        <div className="text-sm text-gray-600">Available: {ticket.available}</div>
                      </div>
                      <div className="font-bold text-lg">₹{ticket.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <AnimatedButton className="w-full">Book Now</AnimatedButton>
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
