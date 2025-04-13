
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import { CalendarDays, CreditCard, Truck, UserX } from 'lucide-react';

const Index = () => {
  // Features section data
  const features = [
    {
      icon: <UserX className="h-10 w-10 text-primary" />,
      title: "No Login Required",
      description: "Book tickets instantly without account creation or OTP verifications."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "QR-based Payments",
      description: "Simply scan, pay via UPI, and submit UTR to confirm your booking."
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Home Delivery",
      description: "Get your tickets delivered to your doorstep within 2 days."
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-primary" />,
      title: "All IPL Matches",
      description: "Access tickets for all IPL matches at the best venues across India."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Book Cricket Tickets Without Hassle</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Eventia simplifies the ticket booking experience with a streamlined process designed for cricket fans.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-4 rounded-lg w-16 h-16 flex items-center justify-center bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Book your tickets in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Select Your Event",
                  description: "Browse IPL matches and other events, select your preferred date and seating."
                },
                {
                  number: "02",
                  title: "Pay via QR Code",
                  description: "Scan the QR code, make payment through any UPI app, and submit your UTR number."
                },
                {
                  number: "03",
                  title: "Receive Your Tickets",
                  description: "Once payment is verified, your tickets will be delivered to your home in 2 days."
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-7xl font-bold text-primary/10 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75H39V5.25H0V6.75Z" fill="#D1D5DB"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Featured Events Section */}
        <FeaturedEvents />
        
        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The no-login process was refreshing! I booked tickets for my family in under 2 minutes.",
                  name: "Rahul Sharma",
                  title: "Cricket Fan, Delhi"
                },
                {
                  quote: "Home delivery was prompt, and the tickets were authentic. Will definitely use Eventia again!",
                  name: "Priya Patel",
                  title: "RCB Supporter, Bangalore"
                },
                {
                  quote: "The QR payment was so convenient. No redirecting to payment gateways or entering card details.",
                  name: "Amit Singh",
                  title: "CSK Fan, Chennai"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <div className="mb-4 text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
