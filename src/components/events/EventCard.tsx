
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/data/eventsData';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-700">
          {event.category}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        
        <div className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {event.description}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-primary/70" />
            <span>{formattedDate} • {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary/70" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-primary/70" />
            <span>{event.duration}</span>
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-600">Starting from</span>
            <div className="font-bold text-lg">
              ₹{Math.min(...event.ticketTypes.map(t => t.price))}
            </div>
          </div>
          <Link to={`/event/${event.id}`}>
            <AnimatedButton size="sm">Book Now</AnimatedButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
