
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Copy, CreditCard, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schema for UPI VPA validation
const upiSchema = z.object({
  merchantName: z.string().min(3, "Merchant name must be at least 3 characters"),
  vpa: z.string()
    .min(5, "UPI VPA must be at least 5 characters")
    .regex(/^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/, "Invalid UPI VPA format (e.g., example@bank)"),
  description: z.string().optional(),
});

type UpiFormValues = z.infer<typeof upiSchema>;

const AdminUpiManagement = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  
  const form = useForm<UpiFormValues>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      merchantName: 'Eventia Tickets',
      vpa: 'eventia@sbi',
      description: 'Official payment account for Eventia ticket purchases',
    }
  });

  const onSubmit = (data: UpiFormValues) => {
    // In a real application, this would update the UPI details in the database
    toast({
      title: "UPI details updated",
      description: "Your UPI VPA has been successfully updated.",
    });
    setLastUpdated(new Date().toLocaleString());
  };

  const copyToClipboard = () => {
    const vpa = form.getValues('vpa');
    navigator.clipboard.writeText(vpa);
    setIsCopied(true);
    toast({
      title: "UPI VPA copied",
      description: "UPI VPA has been copied to clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const refreshQR = () => {
    toast({
      title: "QR Code refreshed",
      description: "The QR code has been regenerated with the current UPI VPA.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">UPI Payment Settings</h1>
            <p className="text-gray-600 mt-1">Manage your UPI Virtual Payment Address (VPA) for ticket transactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    UPI VPA Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="merchantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Merchant Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Eventia Tickets" {...field} />
                            </FormControl>
                            <FormDescription>
                              This name will appear in users' UPI payment apps
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vpa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI VPA</FormLabel>
                            <div className="flex">
                              <FormControl>
                                <Input placeholder="e.g., business@bank" {...field} className="rounded-r-none" />
                              </FormControl>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="rounded-l-none"
                                onClick={copyToClipboard}
                              >
                                {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormDescription>
                              The Virtual Payment Address that will receive payments (e.g., name@bank)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Official payment account for tickets" {...field} />
                            </FormControl>
                            <FormDescription>
                              Additional information about this payment address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end pt-2">
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    UPI QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-md shadow-sm border w-48 h-48 flex items-center justify-center mb-4">
                    {/* In a real app, this would be a dynamically generated QR code */}
                    <div className="text-center">
                      <div className="border-4 border-primary/20 w-32 h-32 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <p className="text-xs text-gray-500">UPI QR Code</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {form.getValues('vpa')}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mb-2"
                    onClick={refreshQR}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh QR Code
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {lastUpdated}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminUpiManagement;
