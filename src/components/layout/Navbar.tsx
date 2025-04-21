
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Ticket, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">{t('app.name')}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              {t('common.event')}
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              {t('navbar.events')}
            </Link>
            <Link to="/ipl-tickets" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              {t('navbar.ipl')}
            </Link>
            <Link to="/admin-login">
              <Button variant="outline" size="sm" className="ml-4 flex items-center">
                <User className="h-4 w-4 mr-2" />
                {t('navbar.admin')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden bg-white",
          isOpen ? "block animate-slide-up" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" 
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            {t('common.event')}
          </Link>
          <Link to="/events" 
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            {t('navbar.events')}
          </Link>
          <Link to="/ipl-tickets" 
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            {t('navbar.ipl')}
          </Link>
          <div className="mt-4 px-3">
            <Link to="/admin-login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                {t('navbar.admin')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
