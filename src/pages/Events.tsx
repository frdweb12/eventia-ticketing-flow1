
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { events } from '@/data/eventsData';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const Events = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get all unique categories
  const categories = ['All', ...new Set(events.map(event => event.category))];

  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Header */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{t('events.title')}</h1>
              <LanguageSwitcher />
            </div>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              {t('events.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white border-b py-4 sticky top-16 z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('events.searchPlaceholder')}
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="text-gray-400 h-5 w-5 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === category || (category === 'All' && selectedCategory === '') 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  >
                    {category === 'All' ? t('common.all') : t(`categories.${category.toLowerCase().replace(/ & /g, 'And')}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {filteredEvents.length > 0 ? (
              <>
                <div className="mb-6 text-gray-600">
                  {t('common.showing')} {filteredEvents.length} {filteredEvents.length === 1 ? t('common.event') : t('common.events')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('common.noEventsFound')}</h2>
                <p className="text-gray-600">
                  {t('common.tryDifferent')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
