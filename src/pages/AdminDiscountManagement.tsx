import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { discountService } from '@/eventia-backend/services/discount.service';
import { Discount } from '@/eventia-backend/models/discount.model';
import DiscountList from '@/components/admin/DiscountList';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const discountSchema = z.object({
  code: z.string().min(3, "Discount code must be at least 3 characters"),
  amount: z.coerce.number().min(1, "Discount amount must be greater than 0"),
  description: z.string().optional(),
  maxUses: z.coerce.number().min(1, "Maximum uses must be at least 1"),
  expiryDate: z.string().optional(),
  autoApply: z.boolean().optional(),
  eventId: z.string().optional(),
  priority: z.coerce.number().min(0).max(100).optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

const AdminDiscountManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [events, setEvents] = useState([]);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: '',
      amount: 0,
      description: '',
      maxUses: 100,
      expiryDate: '',
      autoApply: false,
      eventId: '',
      priority: 0,
    }
  });

  const fetchDiscounts = async () => {
    try {
      const data = await discountService.getAllActiveDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch discount codes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDiscounts();

    const channel = supabase
      .channel('discounts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'discounts' }, 
        (payload) => {
          fetchDiscounts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resetForm = () => {
    form.reset({
      code: '',
      amount: 0,
      description: '',
      maxUses: 100,
      expiryDate: '',
      autoApply: false,
      eventId: '',
      priority: 0,
    });
    setIsEditMode(false);
    setSelectedDiscount(null);
  };

  const handleEditDiscount = (discount: Discount) => {
    form.reset({
      code: discount.code,
      amount: discount.amount,
      description: discount.description || '',
      maxUses: discount.max_uses,
      expiryDate: discount.expiry_date ? new Date(discount.expiry_date).toISOString().split('T')[0] : '',
      autoApply: discount.auto_apply || false,
      eventId: discount.auto_apply ? discount.event_id : '',
      priority: discount.priority || 0,
    });
    setSelectedDiscount(discount);
    setIsEditMode(true);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDiscount) return;
    
    try {
      await discountService.updateDiscountCode(selectedDiscount.id, { is_active: false });
      toast({
        title: "Success",
        description: `Discount code ${selectedDiscount.code} has been deleted.`,
      });
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast({
        title: "Error",
        description: "Failed to delete discount code",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    }
  };

  const onSubmit = async (data: DiscountFormValues) => {
    setIsLoading(true);
    try {
      const discountData = {
        code: data.code.toUpperCase(),
        amount: data.amount,
        description: data.description,
        max_uses: data.maxUses,
        expiry_date: data.expiryDate || null,
        auto_apply: data.autoApply || false,
        event_id: data.autoApply ? data.eventId : null,
        priority: data.priority || 0,
      };

      if (isEditMode && selectedDiscount) {
        await discountService.updateDiscountCode(selectedDiscount.id, discountData);
        toast({
          title: "Discount Updated",
          description: `The discount code ${data.code.toUpperCase()} has been updated.`,
        });
      } else {
        await discountService.createDiscountCode(discountData);
        toast({
          title: "Discount Created",
          description: `The discount code ${data.code.toUpperCase()} has been created.`,
        });
      }
      
      resetForm();
      fetchDiscounts();
    } catch (error) {
      console.error('Error saving discount:', error);
      toast({
        title: "Error",
        description: "Failed to save discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Discount Management</h1>
            <p className="text-gray-600 mt-1">Create and manage discount codes for your events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-primary" />
                  {isEditMode ? "Edit Discount" : "Create New Discount"}
                </CardTitle>
                <CardDescription>
                  {isEditMode 
                    ? `Edit existing discount code: ${selectedDiscount?.code}`
                    : "Set up a new discount code for your events"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., SUMMER2025" {...field} />
                          </FormControl>
                          <FormDescription>
                            A unique code that customers will enter
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                          </FormControl>
                          <FormDescription>
                            Fixed amount to be discounted
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxUses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Uses</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            How many times this code can be used
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            When this discount code expires
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
                            <Input {...field} placeholder="Description of the discount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoApply"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Auto Apply Discount</FormLabel>
                            <FormDescription>
                              Automatically apply this discount to events without manual entry
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('autoApply') && (
                      <>
                        <FormField
                          control={form.control}
                          name="eventId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Event</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an event" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {events.map((event) => (
                                    <SelectItem key={event.id} value={event.id}>
                                      {event.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the event where this discount will be auto-applied
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min="0" max="100" />
                              </FormControl>
                              <FormDescription>
                                Priority for multiple auto-apply discounts (0-100, higher means higher priority)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Saving...' : isEditMode ? 'Update Discount' : 'Create Discount'}
                      </Button>
                      {isEditMode && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Discounts</CardTitle>
                <CardDescription>
                  Currently active discount codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DiscountList 
                  discounts={discounts}
                  onEdit={handleEditDiscount}
                  onDelete={handleDeleteDiscount}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the discount code <strong>{selectedDiscount?.code}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDiscountManagement;
