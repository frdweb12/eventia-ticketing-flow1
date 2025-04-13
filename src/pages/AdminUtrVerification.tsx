
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PenLine, Check, X, Search, Send, Clock, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for UTR verifications
const pendingUTRs = [
  { 
    id: 'UTR12345678', 
    date: '2025-04-10', 
    amount: 3000, 
    event: 'IPL 2025: MI vs CSK', 
    customerName: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 9876543210',
    tickets: [
      { type: 'Premium Stand', quantity: 1, price: 3000 }
    ],
    address: '123 Main St, Andheri East, Mumbai 400069',
    note: ''
  },
  { 
    id: 'UTR23456789', 
    date: '2025-04-11', 
    amount: 10000, 
    event: 'IPL 2025: RCB vs KKR', 
    customerName: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 9876543211',
    tickets: [
      { type: 'VIP Box', quantity: 1, price: 8000 },
      { type: 'General Stand', quantity: 2, price: 1000 }
    ],
    address: '45 Park Avenue, Koramangala, Bangalore 560034',
    note: 'Customer requested express delivery'
  },
  { 
    id: 'UTR34567890', 
    date: '2025-04-12', 
    amount: 1200, 
    event: 'Cricket Legends Meet & Greet', 
    customerName: 'Arjun Singh',
    email: 'arjun.s@example.com',
    phone: '+91 9876543212',
    tickets: [
      { type: 'Standard Entry', quantity: 2, price: 600 }
    ],
    address: '78 Lake View, Salt Lake, Kolkata 700091',
    note: 'First-time customer'
  },
];

const verifiedUTRs = [
  { 
    id: 'UTR45678901', 
    date: '2025-04-09', 
    amount: 8000, 
    event: 'IPL 2025: PBKS vs SRH', 
    customerName: 'Vikram Mehta',
    email: 'vikram.m@example.com',
    phone: '+91 9876543213',
    tickets: [
      { type: 'VIP Box', quantity: 1, price: 8000 }
    ],
    address: '22 Golf Links, Civil Lines, Delhi 110001',
    note: '',
    status: 'Dispatched',
    verifiedBy: 'Admin',
    ticketIds: ['TICKET-001-A', 'TICKET-001-B']
  },
  { 
    id: 'UTR56789012', 
    date: '2025-04-08', 
    amount: 4500, 
    event: 'T20 Cricket Clinic for Kids', 
    customerName: 'Meera Joshi',
    email: 'meera.j@example.com',
    phone: '+91 9876543214',
    tickets: [
      { type: 'Child Entry', quantity: 3, price: 1500 }
    ],
    address: '56 Beach Road, Juhu, Mumbai 400049',
    note: 'Multiple children from same family',
    status: 'Verified',
    verifiedBy: 'Admin',
    ticketIds: ['TICKET-002-A', 'TICKET-002-B', 'TICKET-002-C']
  },
];

const UTRStatusComponent = ({ status }: { status: string }) => {
  switch (status) {
    case 'Verified':
      return (
        <div className="flex items-center text-orange-500">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Verified, Pending Dispatch</span>
        </div>
      );
    case 'Dispatched':
      return (
        <div className="flex items-center text-green-500">
          <Package className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Tickets Dispatched</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Pending</span>
        </div>
      );
  }
};

const AdminUtrVerification = () => {
  const [selectedUTR, setSelectedUTR] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationNote, setVerificationNote] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);

  const filteredPendingUTRs = pendingUTRs.filter(utr => 
    utr.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    utr.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    utr.event.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredVerifiedUTRs = verifiedUTRs.filter(utr => 
    utr.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    utr.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    utr.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewDetails = (utr: any) => {
    setSelectedUTR(utr);
    setIsDetailsOpen(true);
  };

  const verifyUTR = () => {
    // In a real app, this would update the UTR status in the database
    toast({
      title: "UTR Verified",
      description: `UTR ${selectedUTR.id} has been verified successfully.`,
    });
    setIsDetailsOpen(false);
  };

  const rejectUTR = () => {
    // In a real app, this would update the UTR status in the database
    toast({
      title: "UTR Rejected",
      description: `UTR ${selectedUTR.id} has been rejected.`,
      variant: "destructive"
    });
    setIsDetailsOpen(false);
  };

  const dispatchTickets = () => {
    if (!trackingNumber) {
      toast({
        title: "Tracking number required",
        description: "Please enter a tracking number for the shipment.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would update the ticket status in the database
    toast({
      title: "Tickets Dispatched",
      description: `Tickets for UTR ${selectedUTR.id} have been dispatched. Tracking: ${trackingNumber}`,
    });
    setIsDispatchOpen(false);
  };

  const startDispatch = (utr: any) => {
    setSelectedUTR(utr);
    setTrackingNumber('');
    setIsExpressDelivery(false);
    setIsDispatchOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">UTR Verification & Ticket Dispatch</h1>
            <p className="text-gray-600 mt-1">Verify payment UTRs and dispatch tickets to customers</p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search UTRs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex-1">
              <Tabs 
                defaultValue="pending" 
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Pending ({pendingUTRs.length})
                  </TabsTrigger>
                  <TabsTrigger value="verified" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Verified ({verifiedUTRs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-0">
                  <div className="bg-white rounded-md shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium text-gray-500">UTR Number</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Event</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredPendingUTRs.length > 0 ? (
                            filteredPendingUTRs.map((utr) => (
                              <tr key={utr.id} className="hover:bg-muted/20">
                                <td className="px-4 py-3 font-medium">{utr.id}</td>
                                <td className="px-4 py-3 text-gray-600">{new Date(utr.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{utr.customerName}</td>
                                <td className="px-4 py-3 max-w-xs truncate">{utr.event}</td>
                                <td className="px-4 py-3 font-medium">₹{utr.amount.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                  <Button variant="ghost" size="icon" onClick={() => viewDetails(utr)}>
                                    <PenLine className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                No pending UTRs found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="verified" className="mt-0">
                  <div className="bg-white rounded-md shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium text-gray-500">UTR Number</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Event</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredVerifiedUTRs.length > 0 ? (
                            filteredVerifiedUTRs.map((utr) => (
                              <tr key={utr.id} className="hover:bg-muted/20">
                                <td className="px-4 py-3 font-medium">{utr.id}</td>
                                <td className="px-4 py-3 text-gray-600">{new Date(utr.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{utr.customerName}</td>
                                <td className="px-4 py-3 max-w-xs truncate">{utr.event}</td>
                                <td className="px-4 py-3">
                                  <UTRStatusComponent status={utr.status} />
                                </td>
                                <td className="px-4 py-3">
                                  {utr.status === 'Verified' ? (
                                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => startDispatch(utr)}>
                                      <Send className="h-4 w-4 mr-1" />
                                      Dispatch
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="sm" onClick={() => viewDetails(utr)}>
                                      <PenLine className="h-4 w-4 mr-1" />
                                      Details
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                No verified UTRs found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* UTR Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>UTR Verification Details</DialogTitle>
            <DialogDescription>
              Review payment details and verify or reject this UTR.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUTR && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">UTR Number</h3>
                  <p className="text-base font-medium">{selectedUTR.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Date</h3>
                  <p className="text-base">{new Date(selectedUTR.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="text-base font-medium">₹{selectedUTR.amount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Event</h3>
                  <p className="text-base">{selectedUTR.event}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Name</h3>
                    <p className="text-sm">{selectedUTR.customerName}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Contact</h3>
                    <p className="text-sm">{selectedUTR.phone}</p>
                    <p className="text-xs text-gray-500">{selectedUTR.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ticket Details</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Quantity</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUTR.tickets.map((ticket: any, index: number) => (
                      <tr key={index}>
                        <td className="py-2">{ticket.type}</td>
                        <td className="py-2">{ticket.quantity}</td>
                        <td className="py-2">₹{ticket.price.toLocaleString()}</td>
                        <td className="py-2 font-medium">₹{(ticket.quantity * ticket.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                <p className="text-sm">{selectedUTR.address}</p>
              </div>
              
              {selectedUTR.note && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                  <h3 className="text-sm font-medium text-amber-800 flex items-center mb-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Customer Note
                  </h3>
                  <p className="text-sm text-amber-700">{selectedUTR.note}</p>
                </div>
              )}
              
              {selectedUTR.status !== 'Dispatched' && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Verification Note (Optional)</h3>
                  <Input 
                    placeholder="Add notes about this verification..."
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                {selectedUTR.status ? (
                  <Button onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={rejectUTR} className="flex items-center">
                      <X className="h-4 w-4 mr-1" />
                      Reject UTR
                    </Button>
                    <Button onClick={verifyUTR} className="flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Verify UTR
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispatch Tickets Dialog */}
      <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dispatch Tickets</DialogTitle>
            <DialogDescription>
              Enter shipping details to dispatch tickets to the customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUTR && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">UTR: {selectedUTR.id}</h3>
                    <p className="text-xs text-gray-500">{selectedUTR.event}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{selectedUTR.customerName}</p>
                    <p className="text-xs text-gray-500">{selectedUTR.tickets.reduce((acc: number, t: any) => acc + t.quantity, 0)} tickets</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Ticket IDs</h3>
                <div className="bg-gray-50 p-3 rounded-md border text-sm mb-4">
                  {selectedUTR.ticketIds ? (
                    <ul className="space-y-1">
                      {selectedUTR.ticketIds.map((id: string) => (
                        <li key={id} className="text-gray-700">{id}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Ticket IDs will be generated on dispatch</p>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-md border text-sm mb-4">
                  <p className="text-gray-700">{selectedUTR.address}</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <Input 
                    id="tracking"
                    placeholder="Enter courier tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="express" 
                    checked={isExpressDelivery}
                    onCheckedChange={(checked) => setIsExpressDelivery(checked as boolean)}
                  />
                  <label
                    htmlFor="express"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Express Delivery (1-day)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsDispatchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={dispatchTickets} className="flex items-center">
                  <Send className="h-4 w-4 mr-1" />
                  Dispatch Tickets
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminUtrVerification;
