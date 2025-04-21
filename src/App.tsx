
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventManagement from "./pages/AdminEventManagement";
import AdminUpiManagement from "./pages/AdminUpiManagement";
import AdminUtrVerification from "./pages/AdminUtrVerification";
import ARVenuePreview from "./pages/ARVenuePreview";
import IPLTickets from "./pages/IPLTickets";
import NotFound from "./pages/NotFound";

// Import for language configuration
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ipl-tickets" element={<IPLTickets />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-events" element={<AdminEventManagement />} />
          <Route path="/admin-upi" element={<AdminUpiManagement />} />
          <Route path="/admin-utr" element={<AdminUtrVerification />} />
          <Route path="/venue-preview/:id" element={<ARVenuePreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
