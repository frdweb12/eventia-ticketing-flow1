
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";

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
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/layout/BottomNav";

// Import for language configuration
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/payment/:bookingId" element={<Payment />} />
              <Route path="/confirmation/:bookingId" element={<Confirmation />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/ipl-tickets" element={<IPLTickets />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-events" element={<AdminEventManagement />} />
              <Route path="/admin-upi" element={<AdminUpiManagement />} />
              <Route path="/admin-utr" element={<AdminUtrVerification />} />
              <Route path="/venue-preview/:id" element={<ARVenuePreview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
